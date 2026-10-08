# Issue tracker: GitHub

Issues and specs live in GitHub Issues for `hvnxdr/gnome-rounded`.
Use the `gh` CLI from this repo, or pass `--repo hvnxdr/gnome-rounded`.

## Operations

- Create: `gh issue create --title "..." --body-file <file>`
- Read: `gh issue view <number> --comments`
- List: `gh issue list --state open --json number,title,body,labels,assignees`
- Comment: `gh issue comment <number> --body-file <file>`
- Apply labels: `gh issue edit <number> --add-label "..."`
- Remove labels: `gh issue edit <number> --remove-label "..."`
- Close: `gh issue close <number> --comment "..."`

Write multiline issue bodies and comments to a temporary file and
pass it with `--body-file`.

When a skill says "publish to the issue tracker", create a GitHub issue.
When it says "fetch the relevant ticket", read the issue and its comments.

## Pull requests as a triage surface

PRs as a request surface: no.

## Wayfinding

A map is an issue labelled `wayfinder:map`. Its child tickets use
`wayfinder:research`, `wayfinder:prototype`, `wayfinder:grilling`,
or `wayfinder:task`.

Link children using GitHub sub-issues when available. Otherwise, add
`Part of #<map>` to each child and list children in the map's task list.

Record blockers using GitHub issue dependencies when available.
Otherwise, add `Blocked by: #<number>` to the child body.

Choose the first open, unassigned child in map order whose blockers
are all closed. Claim it with `gh issue edit <number> --add-assignee @me`.

To resolve a child, comment with the result, close it, and add a brief
result and link to the map's Decisions-so-far section.
