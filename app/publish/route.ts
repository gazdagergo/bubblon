import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { content } = req.body;

  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
    'User-Agent': 'Next.js Editor',
  };

  const fileRes = await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${process.env.FILE_PATH}`, {
    headers,
  });
  const fileData = await fileRes.json();
  const sha = fileData.sha;

  const commitRes = await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${process.env.FILE_PATH}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: 'Update JSX from editor',
      content,
      sha,
      branch: process.env.BRANCH,
    }),
  });

  if (commitRes.ok) {
    res.status(200).send('Committed successfully');
  } else {
    const error = await commitRes.text();
    res.status(500).send(`Failed to commit: ${error}`);
  }
}
