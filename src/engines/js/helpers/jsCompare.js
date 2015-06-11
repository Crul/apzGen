define(['src/engines/js/helpers/jsUtils'], function (jsUtils) {
	var dis = {};

	dis.equals = jsUtils.renderWrap(equals);
	dis.exactEquals = jsUtils.renderWrap(exactEquals);
	dis.gt = jsUtils.renderWrap(greaterThan);

	function equals(leftSide, rightSide) {
		return compare('==', leftSide, rightSide);
	}

	function exactEquals(leftSide, rightSide) {
		return compare('===', leftSide, rightSide);
	}

	function greaterThan(leftSide, rightSide) {
		return compare('>', leftSide, rightSide);
	}

	function compare(comparator, leftSide, rightSide) {
		leftSide = jsUtils.renderJsNoEol(leftSide);
		rightSide = jsUtils.renderJsNoEol(rightSide);
		return leftSide + ' ' + comparator + ' ' + rightSide;
	}

	return dis;
});