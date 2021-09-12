import * as core from '@actions/core'
import {getOctokit} from '@actions/github'
import * as PR from './pull_request'

const octokit = getOctokit(core.getInput('github_token'))

async function run(): Promise<void> {
  try {
    const baseBranch = core.getInput('base_branch')
    const assignees = (core.getInput('assignees') || '').split(',')
    const labels = (core.getInput('labels') || '').split(',')

    const prNumber = PR.getPrNumber()
    if (!prNumber) {
      throw new Error('Can not get current PR number')
    }

    const pr = await PR.get(octokit, prNumber)
    core.info(JSON.stringify(pr))

    await PR.create(octokit, {
      title: pr.title,
      body: pr.body,
      head: pr.head.ref,
      base: baseBranch,
      assignees,
      labels
    })
  } catch (error) {
    core.setFailed(String(error))
  }
}

run()
