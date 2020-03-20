module.exports = function(crd1, crd2) {
	let x = Math.abs(crd1[0] - crd2[0]);
	let y = Math.abs(crd1[1] - crd2[1]);
	
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
};