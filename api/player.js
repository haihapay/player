export default function handler(req, res) {

    const token = req.query.url;

    if (!token) {
        return res.status(400).send("Missing url");
    }

    let json;

    try {
        const decoded = Buffer
            .from(token.replace(/-/g, "+").replace(/_/g, "/"), "base64")
            .toString("utf8");

        json = JSON.parse(decoded);

    } catch (e) {
        return res.status(400).send("Invalid token");
    }

    if (!json.u) {
        return res.status(400).send("Invalid data");
    }

    let video = json.u;
    let poster = "";

    const pos = video.indexOf("&img=");

    if (pos !== -1) {
        poster = video.substring(pos + 5);
        video = video.substring(0, pos);
    }

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Video Player</title>

<style>
html,body{margin:0;height:100%;background:#000}
video{width:100%;height:100%;object-fit:contain}
</style>
</head>
<body>

<video id="video" controls playsinline poster="${poster}"></video>

<script>
const video=document.getElementById("video");
video.src=${JSON.stringify(video)};
video.preload="metadata";
</script>

</body>
</html>`;

    // QUAN TRỌNG: cho iframe chạy được mọi domain (fix refused to connect)
    res.setHeader("Content-Security-Policy", "frame-ancestors *");

    // QUAN TRỌNG: tránh Vercel override chặn iframe
    res.setHeader("X-Frame-Options", "ALLOWALL");

    res.setHeader("Content-Type", "text/html; charset=utf-8");

    return res.status(200).send(html);
}
