#!/bin/bash

# Navigate to your project directory
cd /path/to/folder/reddit-to-epub || { echo "Failed to change directory"; exit 1; }

# Update the Book Cover to use the current date
DATE=$(date +"%B %d, %Y")
convert /path/to/folder/reddit-to-epub/reddit_book_cover.jpg -gravity South -stroke '#000C' -strokewidth 2 -pointsize 40 -annotate +0+720 "$DATE" -stroke none -fill white -annotate +0+720 "$DATE" /home/jstriblet/Desktop/reddit-to-epub/reddit_book_cover_with_date.jpg
if [ $? -eq 0 ]; then
  echo "$(date): Book cover updated for $DATE." >> /path/to/folder/reddit-to-epub/cron.log
else
  echo "$(date): Book cover failed to update for $DATE." >> /path/to/folder/reddit-to-epub/cron.log
  exit 1
fi

# Run the EPUB creation script
/usr/bin/node /path/to/folder/reddit-to-epub/index.js
if [ $? -eq 0 ]; then
  echo "$(date): EPUB creation successful." >> /path/to/folder/reddit-to-epub/cron.log
else
  echo "$(date): EPUB creation failed." >> /path/to/folder/reddit-to-epub/cron.log
  exit 1
fi

# Run the email sending script
/usr/bin/node /path/to/folder/reddit-to-epub/send_epub_to_kindle.js
if [ $? -eq 0 ]; then
  echo "$(date): Email sent successfully." >> /path/to/folder/reddit-to-epub/cron.log
else
  echo "$(date): Email sending failed." >> /path/to/folder/reddit-to-epub/cron.log
  exit 1
fi