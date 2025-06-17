# BaBa Is You
<img src="https://i.imgur.com/44OJbB0.gif">

Please refer to [README_original.md](README_original.md) to check the original readme.

---

## Setup

### For JavaScript

You need to prepare `pnpm`, which is a package manager for JavaScript. We are currently using `pnpm@9.1.2`, but the version is not strictly fixed. As long as you update `Node.js` and get a compatible newer `pnpm` version (e.g., `pnpm@9` or `pnpm@10`), you can modify the `"packageManager"` field in `package.json` accordingly and check if it is executable.

Once you have set up `pnpm`, run the following:

```bash
cd BaBaIsYou
pnpm install
```

You should see a message confirming that it has been installed successfully.

### For Python

We use `Python` for headless interaction with the game. If you only want to play the game, you may skip this step.

We recommend creating a new virtual environment with `conda`:

```bash
conda create -n baba python=3.9
conda activate baba
pip install playwright  # or try: pip install pytest-playwright
playwright install
```

## Deploy

### Game Deployment

Run the following command:

```bash
pnpm dev
```

You should see a prompt indicating that the game is deployed on `localhost:5173`. You can access it through your browser (after binding the port, if necessary).

### Headless Test

Once the game is deployed, you should be able to interact with it using Python:

```bash
python game_map.py
```
