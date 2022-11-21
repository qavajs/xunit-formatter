const Formatter = require('../src/formatter');
const xml2js = require('xml2js');
const json = require('./report.json');
const magicOptions = new Proxy(function () {}, {
    get() {
        return magicOptions
    },
    apply() {
        return magicOptions
    }
});
test('should return valid xml', async () => {
    const formatter = new Formatter(magicOptions);
    const xml = await xml2js.parseStringPromise(formatter.buildXML(JSON.stringify(json)));
    expect(xml.testsuites.testsuite[0].$).toStrictEqual({
        id: "Feature 1",
        name: "Feature 1",
        package: "Feature 1"
    });
    expect(xml.testsuites.testsuite[0].testcase[0].$).toStrictEqual({
        classname: "Feature 1",
        name: "Scenario 1",
        time: "10"
    });
    expect(xml.testsuites.testsuite[0].testcase[0].failure).toStrictEqual(['ERROR']);
    expect(xml.testsuites.testsuite[0].testcase[1].$).toStrictEqual({
        classname: "Feature 1",
        name: "Scenario 2",
        time: "6"
    });
});
