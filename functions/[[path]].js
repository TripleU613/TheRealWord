const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#e94560"/><stop offset="100%" style="stop-color:#ff6b6b"/></linearGradient></defs><circle cx="50" cy="50" r="45" fill="#0a0a0f"/><text x="50" y="68" font-family="Arial Black, sans-serif" font-size="50" font-weight="900" fill="url(#grad)" text-anchor="middle">W</text></svg>`;

function getHomePage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Real Word</title>
    <meta name="description" content="Create sneaky links that reveal what you really meant to say">
    <meta name="theme-color" content="#0a0a0f">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <meta property="og:title" content="The Real Word">
    <meta property="og:description" content="Create sneaky links that reveal what you really meant to say">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center; background: #0a0a0f; color: white; padding: 20px; overflow: hidden; }
        canvas { position: fixed; top: 0; left: 0; z-index: 0; pointer-events: none; }
        .creator { text-align: center; max-width: 500px; width: 100%; position: relative; z-index: 1; }
        h1 { font-size: 3rem; margin-bottom: 30px; background: linear-gradient(90deg, #fff, #e94560, #fff); background-size: 200% 100%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s ease infinite; position: relative; }
        h1::after { content: ''; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 100px; height: 3px; background: linear-gradient(90deg, transparent, #e94560, transparent); animation: pulse 2s ease infinite; }
        @keyframes shimmer { 0%, 100% { background-position: -100% 0; } 50% { background-position: 100% 0; } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; width: 100px; } 50% { opacity: 1; width: 150px; } }
        .input-wrapper { position: relative; margin-bottom: 15px; }
        input { width: 100%; padding: 18px 25px; font-size: 1.2rem; border: 2px solid #222; border-radius: 15px; background: rgba(255,255,255,0.03); color: white; transition: all 0.3s ease; }
        input:focus { outline: none; border-color: #e94560; box-shadow: 0 0 30px rgba(233,69,96,0.2); background: rgba(255,255,255,0.05); }
        input::placeholder { color: #444; }
        .input-wrapper::before { content: ''; position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px; background: linear-gradient(45deg, #e94560, #4ecdc4, #e94560); border-radius: 17px; z-index: -1; opacity: 0; transition: opacity 0.3s; }
        .input-wrapper:focus-within::before { opacity: 1; animation: borderRotate 3s linear infinite; }
        @keyframes borderRotate { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
        button { width: 100%; padding: 18px 25px; font-size: 1.2rem; font-weight: 600; border: none; border-radius: 15px; background: linear-gradient(135deg, #e94560, #ff6b6b); color: white; cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden; }
        button::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transition: left 0.5s; }
        button:hover::before { left: 100%; }
        button:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(233,69,96,0.4); }
        button:active { transform: translateY(-1px); }
        .link-box { margin-top: 25px; padding: 20px; background: rgba(255,255,255,0.03); border: 1px solid #222; border-radius: 15px; word-break: break-all; display: none; backdrop-filter: blur(10px); }
        .link-box a { color: #4ecdc4; text-decoration: none; font-size: 1.1rem; transition: color 0.3s; }
        .link-box a:hover { color: #5ff5eb; }
        .link-box.show { display: block; animation: slideUp 0.4s ease; }
        .copy-btn { margin-top: 15px; padding: 12px 30px; font-size: 1rem; background: linear-gradient(135deg, #4ecdc4, #44a08d); width: auto; border-radius: 10px; }
        .copy-btn:hover { box-shadow: 0 15px 40px rgba(78,205,196,0.3); }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <div class="creator">
        <h1>The Real Word</h1>
        <div class="input-wrapper"><input type="text" id="word" placeholder="Enter the real word..." autofocus></div>
        <button onclick="generate()">Generate Link</button>
        <div class="link-box" id="linkBox"><a href="#" id="link" target="_blank"></a><br><button class="copy-btn" onclick="copy()">Copy Link</button></div>
    </div>
    <script>
        const input = document.getElementById('word'), linkBox = document.getElementById('linkBox'), linkEl = document.getElementById('link');
        function generate() { const word = input.value.trim(); if (!word) return; const url = location.origin + '/' + encodeURIComponent(word); linkEl.href = url; linkEl.textContent = url; linkBox.classList.add('show'); }
        function copy() { navigator.clipboard.writeText(linkEl.href); document.querySelector('.copy-btn').textContent = 'Copied!'; setTimeout(() => document.querySelector('.copy-btn').textContent = 'Copy Link', 2000); }
        input.addEventListener('keypress', e => { if (e.key === 'Enter') generate(); });
        const canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d'); let particles = [], mouse = { x: null, y: null };
        function resize() { canvas.width = innerWidth; canvas.height = innerHeight; } resize(); addEventListener('resize', resize);
        document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
        class Particle { constructor() { this.reset(); } reset() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.size = Math.random() * 2 + 1; this.baseSpeedX = (Math.random() - 0.5) * 0.3; this.baseSpeedY = (Math.random() - 0.5) * 0.3; this.speedX = this.baseSpeedX; this.speedY = this.baseSpeedY; this.opacity = Math.random() * 0.5 + 0.2; this.hue = Math.random() > 0.5 ? 350 : 175; } update() { if (mouse.x && mouse.y) { const dx = this.x - mouse.x, dy = this.y - mouse.y, dist = Math.sqrt(dx * dx + dy * dy); if (dist < 150) { const force = (150 - dist) / 150; this.speedX += (dx / dist) * force * 0.5; this.speedY += (dy / dist) * force * 0.5; } } this.speedX += (this.baseSpeedX - this.speedX) * 0.05; this.speedY += (this.baseSpeedY - this.speedY) * 0.05; this.x += this.speedX; this.y += this.speedY; if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset(); } draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = 'hsla(' + this.hue + ', 80%, 60%, ' + this.opacity + ')'; ctx.fill(); } }
        for (let i = 0; i < 80; i++) particles.push(new Particle());
        function animate() { ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); particles.forEach((a, i) => { particles.slice(i + 1).forEach(b => { const dx = a.x - b.x, dy = a.y - b.y, dist = Math.sqrt(dx * dx + dy * dy); if (dist < 120) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.strokeStyle = 'rgba(233, 69, 96, ' + (0.15 * (1 - dist / 120)) + ')'; ctx.stroke(); } }); }); requestAnimationFrame(animate); } animate();
    </script>
</body>
</html>`;
}

function getRevealPage(word) {
  const safeWord = word.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, "\\'");
  const headerText = word.trim().includes(' ') ? 'What really had to be said was' : 'The real word was';
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Check this out...</title>
    <meta name="description" content="Someone sent you a message">
    <meta name="theme-color" content="#0a0a0f">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <meta property="og:title" content="Check this out...">
    <meta property="og:description" content="Someone sent you a message">
    <meta name="robots" content="noindex">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center; background: #0a0a0f; color: white; overflow: hidden; }
        canvas { position: fixed; top: 0; left: 0; z-index: 0; }
        .container { position: relative; z-index: 1; text-align: center; padding: 20px; max-width: 100%; }
        .header { font-size: 1.2rem; color: #666; margin-bottom: 20px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: color 0.3s; }
        .header:hover { color: #888; }
        .fall { animation: fallDown 1.5s cubic-bezier(0.55, 0, 1, 0.45) forwards; }
        @keyframes fallDown { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(150vh) rotate(20deg); opacity: 0; } }
        @keyframes fallRotateLeft { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(150vh) rotate(-45deg); opacity: 0; } }
        @keyframes fallRotateRight { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(150vh) rotate(45deg); opacity: 0; } }
        .word { font-size: clamp(1.5rem, 8vw, 5rem); font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; max-width: 90vw; line-height: 1.3; display: flex; flex-wrap: wrap; justify-content: center; gap: 0 0.3em; }
        .word-group { display: inline-block; white-space: nowrap; }
        .word .letter { background: linear-gradient(90deg, #e94560, #ff6b6b, #e94560); background-size: 200% 100%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: gradient 3s ease infinite, letterGlitch 5s infinite; display: inline-block; }
        @keyframes letterGlitch { 0%, 90%, 100% { transform: translateX(0); } 91% { transform: translateX(-2px) skewX(1deg); } 92% { transform: translateX(2px) skewX(-1deg); } 93% { transform: translateX(-1px); } 94% { transform: translateX(0); } }
        @keyframes gradient { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%; background: radial-gradient(circle, rgba(233,69,96,0.3) 0%, transparent 70%); filter: blur(60px); z-index: -1; }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <div class="container">
        <div class="glow" id="glow"></div>
        <div class="header" id="header" onclick="collapse()">${headerText}</div>
        <div class="word" id="word"></div>
    </div>
    <script>
        const wordText = '${safeWord}', wordEl = document.getElementById('word');
        wordText.split(' ').forEach((word, wi) => {
            const group = document.createElement('span');
            group.className = 'word-group';
            word.split('').forEach(char => {
                const span = document.createElement('span');
                span.className = 'letter';
                span.textContent = char;
                group.appendChild(span);
            });
            wordEl.appendChild(group);
        });
        let collapsed = false, particlesDead = false;
        function collapse() { if (collapsed) return; collapsed = true; particlesDead = true; document.getElementById('header').classList.add('fall'); document.getElementById('glow').classList.add('fall'); document.querySelectorAll('.letter').forEach((letter, i) => { const delay = 0.1 + (i * 0.05), anim = Math.random() > 0.5 ? 'fallRotateLeft' : 'fallRotateRight'; letter.style.animation = 'none'; letter.offsetHeight; letter.style.animation = anim + ' 1.5s cubic-bezier(0.55, 0, 1, 0.45) ' + delay + 's forwards'; }); }
        const canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d'); let particles = [];
        function resize() { canvas.width = innerWidth; canvas.height = innerHeight; } resize(); addEventListener('resize', resize);
        class Particle { constructor() { this.reset(); this.gravity = 0; this.rot = (Math.random() - 0.5) * 0.1; } reset() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.size = Math.random() * 2 + 0.5; this.speedX = (Math.random() - 0.5) * 0.5; this.speedY = (Math.random() - 0.5) * 0.5; this.opacity = Math.random() * 0.5 + 0.2; } update() { if (particlesDead) { this.gravity += 0.3; this.speedY += this.gravity * 0.1; this.speedX += this.rot; } this.x += this.speedX; this.y += this.speedY; if (!particlesDead && (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height)) this.reset(); } draw() { if (this.y > canvas.height + 50) return; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = 'rgba(233, 69, 96, ' + this.opacity + ')'; ctx.fill(); } }
        for (let i = 0; i < 100; i++) particles.push(new Particle());
        function animate() { ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); if (!particlesDead) { particles.forEach((a, i) => { particles.slice(i + 1).forEach(b => { const dx = a.x - b.x, dy = a.y - b.y, dist = Math.sqrt(dx * dx + dy * dy); if (dist < 100) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.strokeStyle = 'rgba(233, 69, 96, ' + (0.1 * (1 - dist / 100)) + ')'; ctx.stroke(); } }); }); } requestAnimationFrame(animate); } animate();
    </script>
</body>
</html>`;
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;
  if (path === '/favicon.svg') return new Response(FAVICON, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=31536000' } });
  if (path === '/' || path === '') return new Response(getHomePage(), { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
  const word = decodeURIComponent(path.slice(1));
  if (word) return new Response(getRevealPage(word), { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
  return new Response('Not Found', { status: 404 });
}
