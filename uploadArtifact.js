const core = require('@actions/core');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const {promisify} = require('util');

async function uploadArtifact(meta, artifactPath, url, key){
	try {
		core.info('Starting upload of artifact');

		// Create meta form
		const forms = {
			key: key,
			config: JSON.stringify(meta)
		};
		const formsMap = objToStringMap(forms);
		core.info('Done creating formsMap');

		// Create file form
		const fileForms = {
			file: artifactPath
		};
		const fileFormsMap = objToStringMap(fileForms);
		core.info('Done creating fileForms');

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
		core.info(consoleOutputJSON);

		if (statusCode >= 400) {
			core.setFailed(`HTTP request failed with status code: ${statusCode}`);
		} else {
			const outputJSON = JSON.stringify(outputObject);
			core.setOutput('output', outputJSON);
		}
	} 
	catch (error) {
			core.setFailed(error.message);
	}
}

async function uploadFile(url, forms, fileForms) {
	const form = await buildForm(forms, fileForms);
	const headers = await getFormHeaders(form);

	return axios.post(url, form, {
		headers: headers, 
		maxContentLength: Infinity
	});
}

async function buildForm(forms, fileForms) {
	const form = new FormData();

	for (const [key, value] of forms){
		form.append(key, value);
	}

	for (const [key, value] of fileForms){
		form.append(key, fs.createReadStream(value));
	}

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

function objToStringMap(obj){
	let strMap = new Map();

	for (let k of Object.keys(obj))
	  strMap.set(k, obj[k]);

	return strMap;
}

module.exports = uploadArtifact;