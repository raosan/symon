# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Fork Process

1. Ensure that you've installed the necessary tools in your system (eg, node-js and npm).
2. Fork this project into your own Github account.
3. When forking is done, clone `symon` from your account.

    ```git
    git clone git@github.com:YOUR_USERNAME/symon.git
    ```

4. Enter the cloned directory.
5. Specify new remote upstream that will be synched with your fork.

    ```git
    git remote add upstream git@github.com:hyperjumptech/symon.git
    ```

6. Verify the new upstream you've specified for your fork.

    ```git
    $ git remote -v
    > origin    git@github.com:YOUR_USERNAME/symon.git (fetch)
    > origin    git@github.com:YOUR_USERNAME/symon.git (push)
    > upstream  git@github.com:hyperjumptech/symon.git (fetch)
    > upstream  git@github.com:hyperjumptech/symon.git (push)
    ```

7. Now you can start committing code on your account
8. Remember to pull from your upstream often.

    ```git
    git pull upstream main
    ```

## Pull Request Process

1. Make sure you always have the most recent update from your upstream.

    ```git
    git pull upstream main
    ```
    
2. Resolve all conflict, if any.
3. Make sure `make test` always successful (you wont be able to create pull request if this fail, circle-ci, travis-ci and azure-devops will make sure of this.)
4. Push your code to your project's master repository.
5. Create PullRequest.
    * Go to `github.com/hyperjumptech/symon`
    * Select `Pull Request` tab
    * Click `New pull request` button
    * Click `compare across fork`
    * Change the source head repository from your fork and target is `hyperjumptech/symon`
    * Hit the `Create pull request` button
    * Fill in all necessary information to help us understand about your pull request.
