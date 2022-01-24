const core = require('@actions/core');
const github = require('@actions/github');
const uploadArtifact = require('./uploadArtifact');

async function run() {
	try {
		// Read all variables from action
		const inputAppId = core.getInput('appid');
		const inputVersion = core.getInput('version');
		const inputArtifactPath = core.getInput('artifact');
		const inputUrl = core.getInput('url');
		const inputKey = core.getInput('key');
		const inputMessage = core.getInput('message');
		
		// Get values from context
		const commitSha = github.context.sha;
		const buildRun = github.context.runNumber;

		// Create package meta data JSON
		const meta = {
			Version: inputVersion,
			AppId: inputAppId,
			BuildRun: buildRun,
			Commit: commitSha,
			CommitMessage: inputMessage
		};

		// Log
		core.info('Meta created: ' + meta);
		core.info('URL: ' + inputUrl);
		core.info('Artifact Path: ' + inputArtifactPath);

		// Submit package+meta to CoreDeploy
		uploadArtifact(meta, inputArtifactPath, inputUrl, inputKey);
	} 
	catch (error) {
		core.setFailed(error.message);
	}
}

// Run it
run();