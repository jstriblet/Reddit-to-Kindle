# Reddit-to-Kindle

## Description:

Reddit-to-Kindle is a set Node.js and shell scripts that converts Reddit RSS feeds into ePub format, making it easy to read Reddit posts on your Kindle or other eBook readers. The script fetches Reddit posts, including comments, and organizes them by subreddit. Additionally, it adds a customized cover image with the current date.

![IMG_1006](https://github.com/jstriblet/Reddit-to-Kindle/assets/12757245/6c589315-64e3-47a6-947e-38346784e5db)
![IMG_1001](https://github.com/jstriblet/Reddit-to-Kindle/assets/12757245/f0b6943e-d035-44f9-8ba4-ec12329e00a4)
![IMG_1003](https://github.com/jstriblet/Reddit-to-Kindle/assets/12757245/9d50ebe8-5529-4653-aa03-3098229e474d)
![IMG_0999](https://github.com/jstriblet/Reddit-to-Kindle/assets/12757245/7ac90c51-71ec-4145-b83d-892ca0278d7a)

## Features:

- Fetch Reddit RSS Feeds: Retrieve the latest posts from any Reddit RSS feed.
- Convert to ePub: Convert Reddit posts into ePub format, suitable for eBook readers.
- Organize by Subreddit: Posts are categorized by their respective subreddits for easy navigation.
- Include Comments: Fetch and include comments in the ePub to preserve the context of discussions.
- Custom Cover Image: Automatically generate a cover image with the current date.
- Easy Setup and Use: Simple setup with Node.js and npm, with clear instructions provided.

I work on this project in my spare time between my day job and raising my daughter. If you end up using and enjoying this please consider [buying me a beer]() thanks! 

## Installation:

**1. Clone the repository:**
  ```bash
  git clone https://github.com/jstriblet/reddit-to-kindle.git
  cd reddit-to-kindle
  ```

**2. Install dependencies:**

  ```bash
  npm install
  ```

**3. Install ImageMagick:**

  macOS:
   ```
   brew install imagemagick
   ```
      
  Ubuntu/Debian:
  ```
  sudo apt-get install imagemagick
  ```

  Windows:
  
  Download and install from the [ImageMagick official website](https://imagemagick.org/script/download.php).

**4. Install Python (if not already installed):**

macOS:
```
brew install python
```

Ubuntu/Debian:
```
sudo apt-get install python3
```

Windows:
Download and install from the [Python official website](https://www.python.org/downloads/).

## Usage:
**1. Generate ePub from Reddit RSS:**
```
cd /path/to/folder/reddit-to-kindle
npm start
```

**Setting Up**

1. Create a GMX Account:

Sign up for a free GMX email account here.

2. Configure Your Amazon Kindle Email Settings:

Go to the [Amazon Kindle Settings](https://www.amazon.com/hz/mycd/myx#/home/settings/) and add your new GMX email address to the approved email list. This allows you to send documents to your Kindle.

<img width="1319" alt="Screenshot 2024-06-08 at 10 50 24 AM" src="https://github.com/jstriblet/Reddit-to-Kindle/assets/12757245/14a2631a-88af-4dbb-a2c4-1075172c4762">

**Running the Scripts**

1. Update the email address in `send_epub_to_kindle.js` to your unique kindle email address this is also found in your [Amazon Kindle Settings](https://www.amazon.com/hz/mycd/myx#/home/settings/)

2. Update the paths in all the scripts to point to where you downloaded this repository. ie replace "/path/to/folder" to where you have the `/reddit-to-epub/` directory.
this should be updated in the following files:
    1. index.js
    2. run_scripts.sh

3. Running All Scripts:
This script updates the base cover image with the current date, generates the ePub from the Reddit RSS feed, and sends it to your Kindle email address  by calling the afformentioned files.

```
./run_scripts.sh
```

**Automating with Cron**

To automate the process, you can set up a cron job that runs the scripts at a specified interval (e.g., daily). Here’s how to set up a cron job on a Unix-like system:

Open the crontab file for editing:

```
crontab -e
```

Add the following line to schedule the job (e.g., daily at 7 AM):

```
0 7 * * * /home/jstriblet/Desktop/reddit-to-epub/run_scripts.sh
```

Save and exit the crontab editor.

## Contributing:

Contributions are welcome! Please fork the repository and submit a pull request to contribute to this project.

## License:

This project is licensed under the MIT License.


