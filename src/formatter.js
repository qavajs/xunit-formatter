const { JsonFormatter } = require('@cucumber/cucumber');
const xml2js = require('xml2js');
class XunitFormatter extends JsonFormatter {

    constructor(options) {
        super(options);
        const log = this.log.bind(this);
        this.log = function(json) {
            log(this.buildXML(json));
        }
    }

    buildXML(json) {
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

        return new xml2js.Builder({
            xmldec: {noValidation: true},
            cdata: true
        }).buildObject(xml)
    }

    getTestCases(testSuiteData) {
        return testSuiteData.elements.map((testCase) => {
            let tc = {
                $: {
                    name: this.escapeXMLChars(testCase.name),
                    classname: this.escapeXMLChars(testSuiteData.name),
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
                        value: this.escapeXMLChars(testSuiteData.uri)
                    }
                }
            }
        ]
    }

    getTestSuiteAttrs(testSuiteData) {
        return {
            name: this.escapeXMLChars(testSuiteData.name),
            package: this.escapeXMLChars(testSuiteData.name),
            id: this.escapeXMLChars(testSuiteData.name)
        }
    }

    escapeXMLChars(xmlStr) {
        return xmlStr.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

}

module.exports = XunitFormatter;
