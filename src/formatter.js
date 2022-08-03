const { JsonFormatter } = require('@cucumber/cucumber');
const xml2js = require('xml2js');
class XunitFormatter extends JsonFormatter {

    constructor(options) {
        super(options);
        const log = this.log.bind(this);
        this.log = function (json) {
            const xml = {
                testsuites: JSON.parse(json).map((testSuiteData) => {
                    return {
                        testsuite: {
                            $: this.getTestSuiteAttrs(testSuiteData),
                            properties: this.getProperties(testSuiteData),
                            testcase: this.getTestCases(testSuiteData)
                        }
                    }
                })
            }
            log(new xml2js.Builder().buildObject(xml));
        }


    }

    getTestCases(testSuiteData) {
        return testSuiteData.elements.map((testCase) => {
            let tc = {
                $: {
                    name: testCase.name,
                    classname: testSuiteData.name,
                    time: (testCase.steps.reduce((acc, step) => acc + (step.result.duration ? step.result.duration : 0), 0) / 1000000000).toString()
                }
            };
            const failedStep = testCase.steps.find((testStep) => {
                return testStep.result.status === 'failed'
            });

            if (failedStep) {
                tc.failure = failedStep.result.error_message
            }
            return tc
        })
    }

    getProperties(testSuiteData) {
        return [
            {
                property: {
                    $: {
                        name: 'URI',
                        value: testSuiteData.uri
                    }
                }
            }
        ]
    }

    getTestSuiteAttrs(testSuiteData) {
        return {
            name: testSuiteData.name,
            package: testSuiteData.name,
            id: testSuiteData.name
        }
    }

}

module.exports = XunitFormatter;
