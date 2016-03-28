var stats = require("../lib/data-statistics.js");
var should = require('chai').should();

var testData = require("./testData.json");

var DS = new stats.DataStatistics({elements: testData[0]});

//load some data to frequency object
testData.forEach(function(row, i) {
    console.log("adding row "+i);
    DS.updateStatistics(row);
});

//check values
var frequencyObject = DS.getFrequencyObject();
frequencyObject.should.be.an("array");
frequencyObject.should.have.length(2);

var frequencyObjectForField = DS.getFrequencyObjectForField(0);
frequencyObjectForField.should.have.property("freq").which.is.an("array").and.have.length(5);
frequencyObjectForField.freq[0].should.have.property("label").that.equals("John");
frequencyObjectForField.freq[0].should.have.property("value").that.equals(11);

var topFrequencyObject = DS.getTopFrequencyObject();
topFrequencyObject.should.be.an("array");
topFrequencyObject.should.have.length(2);

var topFrequencyObjectForField = DS.getTopFrequencyObjectForField(0);
topFrequencyObjectForField.should.have.property("freq").which.is.an("array").and.have.length(5);
topFrequencyObjectForField.freq[0].should.have.property("label").that.equals("John");
topFrequencyObjectForField.freq[0].should.have.property("value").that.equals(11);

var topFrequencyObjectForField = DS.getTopFrequencyObjectForField(1);
topFrequencyObjectForField.should.have.property("freq").which.is.an("array").and.have.length(10);
topFrequencyObjectForField.freq[0].should.have.property("label").that.equals(2);
topFrequencyObjectForField.freq[0].should.have.property("value").that.equals(1);

var topMaskFrequencyObjectForField = DS.getTopMaskFrequencyObjectForField(1);
topMaskFrequencyObjectForField.should.have.property("freq").which.is.an("array").and.have.length(4);
topMaskFrequencyObjectForField.freq[0].should.have.property("label").that.equals("D");
topMaskFrequencyObjectForField.freq[0].should.have.property("value").that.equals(10);

var topMaskFrequencyObject = DS.getTopMaskFrequencyObject();
topMaskFrequencyObject.should.be.an("array");
topMaskFrequencyObject.should.have.length(2);

var nullObjectForField = DS.getNullObjectForField(0);
nullObjectForField.should.have.property("nullCount").which.is.an("Object").which.have.property("null").which.equals(2);
nullObjectForField.should.have.property("nullCount").which.is.an("Object").which.have.property("nonNull").which.equals(13);

var nullObject = DS.getNullObject();
nullObject.should.be.an("array");
nullObject.should.have.length(2);

var maskDistinctCOuntsForField = DS.getMasksDistinctCountsForField(0);
maskDistinctCOuntsForField.should.be.an("object");
maskDistinctCOuntsForField.should.have.property("nonUnique").which.equal(2);
maskDistinctCOuntsForField.should.have.property("unique").which.equal(2);
maskDistinctCOuntsForField.should.have.property("duplicate").which.equal(11);
maskDistinctCOuntsForField.should.have.property("distinct").which.equal(4);

var maskDistinctCounts = DS.getMasksDistinctCounts();
maskDistinctCounts.should.be.an("array").which.has.length(2);

//load more data to frequency object
testData.forEach(function(row, i) {
    console.log("adding row "+i);
    DS.updateStatistics(row);
});

//check values
var frequencyObject = DS.getFrequencyObject();
frequencyObject.should.be.an("array");
frequencyObject.should.have.length(2);

var frequencyObjectForField = DS.getFrequencyObjectForField(0);
frequencyObjectForField.should.have.property("freq").which.is.an("array").and.have.length(5);
frequencyObjectForField.freq[0].should.have.property("label").that.equals("John");
frequencyObjectForField.freq[0].should.have.property("value").that.equals(22);

var topFrequencyObject = DS.getTopFrequencyObject();
topFrequencyObject.should.be.an("array");
topFrequencyObject.should.have.length(2);

var topFrequencyObjectForField = DS.getTopFrequencyObjectForField(0);
topFrequencyObjectForField.should.have.property("freq").which.is.an("array").and.have.length(5);
topFrequencyObjectForField.freq[0].should.have.property("label").that.equals("John");
topFrequencyObjectForField.freq[0].should.have.property("value").that.equals(22);

var topFrequencyObjectForField = DS.getTopFrequencyObjectForField(1);
topFrequencyObjectForField.should.have.property("freq").which.is.an("array").and.have.length(10);
topFrequencyObjectForField.freq[0].should.have.property("label").that.equals('');
topFrequencyObjectForField.freq[0].should.have.property("value").that.equals(2);

var topMaskFrequencyObjectForField = DS.getTopMaskFrequencyObjectForField(1);
topMaskFrequencyObjectForField.should.have.property("freq").which.is.an("array").and.have.length(4);
topMaskFrequencyObjectForField.freq[0].should.have.property("label").that.equals("D");
topMaskFrequencyObjectForField.freq[0].should.have.property("value").that.equals(20);

var topMaskFrequencyObject = DS.getTopMaskFrequencyObject();
topMaskFrequencyObject.should.be.an("array");
topMaskFrequencyObject.should.have.length(2);

var nullObjectForField = DS.getNullObjectForField(0);
nullObjectForField.should.have.property("nullCount").which.is.an("Object").which.have.property("null").which.equals(4);
nullObjectForField.should.have.property("nullCount").which.is.an("Object").which.have.property("nonNull").which.equals(26);

var nullObject = DS.getNullObject();
nullObject.should.be.an("array");
nullObject.should.have.length(2);

var maskDistinctCOuntsForField = DS.getMasksDistinctCountsForField(0);
maskDistinctCOuntsForField.should.be.an("object");
maskDistinctCOuntsForField.should.have.property("nonUnique").which.equal(4);
maskDistinctCOuntsForField.should.have.property("unique").which.equal(0);
maskDistinctCOuntsForField.should.have.property("duplicate").which.equal(26);
maskDistinctCOuntsForField.should.have.property("distinct").which.equal(4);

var maskDistinctCounts = DS.getMasksDistinctCounts();
maskDistinctCounts.should.be.an("array").which.has.length(2);