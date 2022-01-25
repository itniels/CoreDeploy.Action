# CoreDeploy.Action
GitHub Action for integrating with CoreDeploy server

## What is CoreDeploy 
It is my own custom artifact storage and deployment tool, not available for public.

## Usage
You need two secrets added, Url to CoreDeploy `${{secrets.COREDEPLOY_URL}}` and ingress key for authorization `${{secrets.COREDEPLOY_INGRESSKEY}}`.

Make sure the application creates a single zip file eg. `artifact.zip`.

In your build add as a step like this:
```yml
- name: Core Deploy
  uses: itniels/CoreDeploy.Action@main
  with:
    appid: 123
    version: 1.1.${{github.run_number}}
    artifact: ${{github.workspace}}/test/artifact.zip
    message: ${{github.event.head_commit.message}}
    url: ${{secrets.COREDEPLOY_URL}}
    key: ${{secrets.COREDEPLOY_INGRESSKEY}}
```

### Field descriptions
`appid` is the application id created by CoreDeploy server.

`version` version number in a `1.2.3` format, usually the TAG.

`artifact`: full path to the artifact zip file.

`message`: Can be any message, usually last commit message.

`url` full url to ingress endpoint on CoreDeploy, kept in a secret.

`key`: Ingress key to authorize the upload, kept as a secret.

## How to update and compile the action
1) Make changes to code
2) run `npm install` which will update node_modules and run ncc to build dist
3) Push changes to github to deploy
