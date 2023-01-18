# Setup Testkube CLI

Sample workflow to install a specific version of the testkube CLI binary on the runner.

Acceptable values are latest or any semantic version string like v1.28.0. Use this action in workflow to define which version of testkube will be used.

```yaml
- uses: Sonlis/setup-testkube-cli@v1
  with:
    version: '<version>' # default is latest version available from here: https://github.com/kubeshop/testkube/releases
  id: install
```

Refer to the action metadata file for details about all the inputs https://github.com/Azure/setup-kubectl/blob/main/action.yml

Heavily influenced by [setup-kubectl from Azure](https://github.com/Azure/setup-kubectl)
