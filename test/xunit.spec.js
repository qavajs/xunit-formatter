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
    const xmlString = formatter.buildXML(JSON.stringify(json));
    const xml = await xml2js.parseStringPromise(xmlString);
    expect(xml.testsuites.testsuite[0].$).toMatchObject({
        id: 'Feature 1',
        name: 'Feature 1',
        package: 'Feature 1'
    });
    expect(xml.testsuites.testsuite[0].testcase[0].$).toMatchObject({
        classname: 'Feature 1',
        name: 'Scenario 1',
        time: '10'
    });
    expect(xml.testsuites.testsuite[0].testcase[0].failure).toMatchObject(['ERROR']);
    expect(xml.testsuites.testsuite[0].testcase[1].$).toMatchObject({
        classname: 'Feature 1',
        name: 'Scenario 2',
        time: '6'
    });
});
