# 🎥 yt-dlp Cheatsheet (Linux / Ubuntu)

Files are automatically saved into the Home directory folder:  Youtube Video Downloads Archive
-in best possible quality video+audio, in mp4.
-personalised config file created and implemented with gpt5 on 28092025 in the early hours of the morn...

to use, in the terminal: type
yt-dlp <url>
...bobs your aunties sisters cousin..

## Default behaviour (via config)
- Downloads **best video + best audio**
- Saves to: `/home/obsidan/Youtube Video Downloads Archive`
- Filenames: `Title [VideoID].mp4`
- Always merged into `.mp4`

Usage:
```bash
yt-dlp <URL>

FOR AUDIO ONLY:

Brilliant — glad it worked straight off! Linux done right is a joy. Let’s add your audio-only alias, and then I’ll give you a neat cheat-sheet you can stash away.

⸻

1. Add the Audio-Only Alias

Easiest way: define a shell alias in your ~/.bashrc (or ~/.zshrc if you use zsh).

Edit your bashrc:

nano ~/.bashrc

Add at the bottom:

# yt-dlp audio-only alias
alias ytaudio='yt-dlp -x --audio-format mp3 --audio-quality 0 \
-P home:"/home/obsidan/Youtube Video Downloads Archive/Audio Only" \
-o "%(title)s [%(id)s].%(ext)s"'

Then reload your shell:

source ~/.bashrc

Now you can just run:

ytaudio <URL>

It’ll extract best audio → MP3 (highest quality) and drop it into
/home/obsidan/Youtube Video Downloads Archive/Audio Only.

⸻

2. Cheatsheet (save this to a .txt or .md)

# 🎥 yt-dlp Cheatsheet (Linux / Ubuntu)

## Default behaviour (via config)
- Downloads **best video + best audio**
- Saves to: `/home/obsidan/Youtube Video Downloads Archive`
- Filenames: `Title [VideoID].mp4`
- Always merged into `.mp4`

Usage:
```bash
yt-dlp <URL>


⸻

Common Commands

1. Audio Only (alias set in ~/.bashrc)

ytaudio <URL>

	•	Extracts audio, saves as MP3 (highest quality)
	•	Destination: /home/obsidan/Youtube Video Downloads Archive/Audio Only

⸻

2. Override Download Location

yt-dlp -P home:"/path/to/folder" <URL>

3. Override Filename

yt-dlp -o "%(title)s.%(ext)s" <URL>

4. Specific Quality
	•	Best 1080p if available:

yt-dlp -f "bv*[height=1080]+ba/b" <URL>

	•	Best audio-only stream (no convert):

yt-dlp -f bestaudio <URL>

5. Speed Limit

yt-dlp -r 4M <URL>


⸻

Config File Location

~/.config/yt-dlp/config

Edit with:

nano ~/.config/yt-dlp/config

Current defaults inside:

-f bv*+ba/b
-P home:"/home/obsidan/Youtube Video Downloads Archive"
-o "%(title)s [%(id)s].%(ext)s"
--merge-output-format mp4


⸻

Handy Tips
	•	Update yt-dlp regularly:

yt-dlp -U

	•	Dry-run without downloading:

yt-dlp -F <URL>

(lists available formats)

---

Do you want me to wrap this cheat-sheet into a **styled PDF** (like the Linux command cheat-sheet we discussed before), so you can print and keep it at your desk?