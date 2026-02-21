# Install & Prime

## Read
- `.env.example` (never read .env)
- `./app/README.md`

## Read and Execute
.claude/commands/prime.md

## Run
- Think through each of these steps to make sure you don't miss anything.
- Remove the existing git remote: `git remote remove origin`
- Initialize a new git repository: `git init`
- Make scripts executable: `chmod +x scripts/*.sh`
- Run `./scripts/copy_dot_env.sh` to create .env files from env.example templates
- Install frontend dependencies:
  ```bash
  cd app/client && npm install
  ```
- Install backend dependencies (using UV, fallback to pip):
  ```bash
  cd app/server
  if command -v uv &> /dev/null; then
    uv sync
  else
    pip install -r requirements.txt
  fi
  ```
- On a background process, run `./scripts/start.sh` with 'nohup' or a 'subshell' to start the server so you don't get stuck

## Report
- Output the work you've just done in a concise bullet point list.
- Instruct the user to fill out `.env` based on `.env.example` with their credentials.
- Instruct the user to verify `./app/client/.env` exists (it should have been created with default API URL settings).
- Mention the url of the frontend application we can visit based on `scripts/start.sh`
- Mention: 'To setup your project with version control, be sure to update the remote repo url and push to a new repo so you have access to git issues and git PRs:
  ```
  git remote add origin <your-new-repo-url>
  git push -u origin main
  ```'
- Mention: 'To start the application, run:
  ```
  ./scripts/start.sh
  ```
  or use the `/start` command.'
- Mention: If you want to upload images to github during the review process setup cloudflare for public image access you can setup your cloudflare environment variables. See env.example for the variables.
