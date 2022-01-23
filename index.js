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
		// Get values from context
		const buildRun = github.context.run_id;
		core.info('buildRun: ' + buildRun);
		const commitSha = github.context.sha;
		core.info('commitSha: ' + commitSha);
		const commitMessage = github.context.event.head_commit.message;
		core.info('commitMessage: ' + commitMessage);

		// Create package meta data JSON
		const meta = {
			Version: inputVersion,
			AppId: inputAppId,
			BuildRun: buildRun,
			Commit: commitSha,
			CommitMessage: commitMessage
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