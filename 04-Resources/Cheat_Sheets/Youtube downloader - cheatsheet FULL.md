
# 🎥 yt-dlp Cheatsheet (Linux / Ubuntu)

Your personal guide for downloading video & audio with **yt-dlp**.  
Defaults are already configured in your `~/.config/yt-dlp/config`.

---

## ✅ Default Behaviour (via Config)
- Always downloads **best video + best audio** (merged into MP4).
- Saves to:  
  `/home/obsidan/Youtube Video Downloads Archive`
- Filenames look like:  
  `Title [VideoID].mp4`

Usage:
```bash
yt-dlp <URL>


⸻

🎧 Audio-Only Alias

Alias defined in ~/.bashrc:

alias ytaudio='yt-dlp -x --audio-format mp3 --audio-quality 0 \
-P home:"/home/obsidan/Youtube Video Downloads Archive/Audio Only" \
-o "%(title)s [%(id)s].%(ext)s"'

Reload with:

source ~/.bashrc

Now run:

ytaudio <URL>

This extracts audio as MP3 (highest quality) and saves under:

/home/obsidan/Youtube Video Downloads Archive/Audio Only


⸻

📂 Overriding Location or Filenames

Change folder temporarily:

yt-dlp -P home:"/path/to/folder" <URL>

Change filename template:

yt-dlp -o "%(title)s.%(ext)s" <URL>


⸻

🎯 Selecting Quality

Best 1080p + audio (if available):

yt-dlp -f "bv*[height=1080]+ba/b" <URL>

Best audio-only stream (no conversion):

yt-dlp -f bestaudio <URL>

List all available formats before choosing:

yt-dlp -F <URL>


⸻

🚀 Speed & Limits

Throttle download speed (e.g., 4 MB/s):

yt-dlp -r 4M <URL>


⸻

⚙️ Config File Details

Located at:

~/.config/yt-dlp/config

Edit with:

nano ~/.config/yt-dlp/config

Current defaults:

-f bv*+ba/b
-P home:"/home/obsidan/Youtube Video Downloads Archive"
-o "%(title)s [%(id)s].%(ext)s"
--merge-output-format mp4


⸻

🛠️ Useful Tips
	•	Update yt-dlp regularly:

yt-dlp -U

	•	Test without downloading (list formats only):

yt-dlp -F <URL>

	•	Safer filenames (ASCII only):

yt-dlp --restrict-filenames <URL>


⸻

🔧 Advanced Extras

🎬 Download specific time range / chapters

yt-dlp --download-sections "*00:30-02:00" <URL>
yt-dlp --download-sections "intro" <URL>

(Requires ffmpeg.)

⸻

🎞️ Merge or convert formats
	•	Remux video to MP4 (no re-encode, just re-containerise):

yt-dlp --remux-video mp4 <URL>

	•	Re-encode video to MP4 (slower, quality loss possible):

yt-dlp --recode-video mp4 <URL>

	•	Extract audio in another format (e.g. m4a, opus, flac):

yt-dlp -x --audio-format m4a <URL>


⸻

📜 Subtitles
	•	Download with subtitles (if available):

yt-dlp --write-subs --sub-lang en <URL>

	•	Embed subtitles into video:

yt-dlp --embed-subs <URL>


⸻

📂 Playlists
	•	Download entire playlist:

yt-dlp <PLAYLIST_URL>

	•	Only specific videos from playlist (e.g., #2–4):

yt-dlp --playlist-items 2-4 <PLAYLIST_URL>


⸻

🌐 Post-Processing
	•	Embed thumbnail into MP3/MP4:

yt-dlp --embed-thumbnail <URL>

	•	Embed metadata (title, artist, etc.):

yt-dlp --add-metadata <URL>


⸻

🎩 Notes
	•	bv = best video stream, ba = best audio stream.
	•	bv*+ba/b = try video+audio merged, otherwise fallback to best single file.
	•	Config + alias cover 95% of daily use. Advanced flags are there when you need more control.

⸻


---

Would you like me to also add a **section on automation** (e.g. using a text file of URLs, or auto-archive mode) so you can queue up big lists without typing them one by one?