const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const {promisify} = require('util');

async function artifact(meta, artifactPath, url, key){
	core.info('Starting upload of artifact');
	try {
		// Create meta form
		const forms = {
			key: key,
			config: meta
		};
		const formsMap = jsonToMap(forms);
		core.info('Done creating formsMap', formsMap);

		// Create file form
		const fileForms = {
			file: artifactPath
		};
		const fileFormsMap = jsonToMap(fileForms);
		core.info('Done creating fileForms', fileForms);

		// http request
		const response = await uploadFile(url, formsMap, fileFormsMap);

		const method = 'post';
		const statusCode = response.status;
		const data = response.data;
		const outputObject = {
			url,
			method,
			statusCode,
			data
		};

		const consoleOutputJSON = JSON.stringify(outputObject, undefined, 2);
		console.log(consoleOutputJSON);

		if (statusCode >= 400) {
			core.setFailed(`HTTP request failed with status code: ${statusCode}`);
		} else {
			const outputJSON = JSON.stringify(outputObject);
			core.setOutput('output', outputJSON);
		}
	} 
	catch (error) {
			console.log(error);
			core.setFailed(error.message);
	}
}

async function buildForm(forms, fileForms) {
	const form = new FormData();
		for (const [key, value] of forms)
			form.append(key, value);

		for (const [key, value] of fileForms)
			form.append(key, fs.createReadStream(value));

		console.log(form);

		return form
}

async function getFormHeaders (form) {
	const getLen = promisify(form.getLength).bind(form);
	const len = await getLen();

	return {
		...form.getHeaders(),
		'Content-Length': len
	}
}

async function uploadFile(url, forms, fileForms) {
		console.log(url);
		console.log(forms);
		console.log(fileForms);

		const form = buildForm(forms, fileForms);
		const headers = await getFormHeaders(form);

		console.log(headers);

		return axios.post(url, form, {headers: headers,maxContentLength: Infinity})
}

async function jsonToMap(jsonStr){
	let obj = JSON.parse(jsonStr);
	let strMap = new Map();
	
	for (let k of Object.keys(obj))
		strMap.set(k, obj[k]);

	return strMap;
}

module.exports = artifact;