export default function Head() {
  return (
    <>
      {/* preloads */}
      <link
        rel="preload"
        href="https://scripts.converteai.net/3a4fbb06-ca28-4858-9d27-5208e40d8e6d/players/67dabe7b49c4b7bf82565f10/player.js"
        as="script"
      />
      <link
        rel="preload"
        href="https://scripts.converteai.net/lib/js/smartplayer/v1/smartplayer.min.js"
        as="script"
      />
      <link
        rel="preload"
        href="https://images.converteai.net/3a4fbb06-ca28-4858-9d27-5208e40d8e6d/players/67dabe7b49c4b7bf82565f10/thumbnail.jpg"
        as="image"
      />
      <link
        rel="preload"
        href="https://cdn.converteai.net/3a4fbb06-ca28-4858-9d27-5208e40d8e6d/67dabe6a08bb278e587f24e3/main.m3u8"
        as="fetch"
      />

      {/* dns-prefetch */}
      <link rel="dns-prefetch" href="https://cdn.converteai.net" />
      <link rel="dns-prefetch" href="https://scripts.converteai.net" />
      <link rel="dns-prefetch" href="https://images.converteai.net" />
      <link rel="dns-prefetch" href="https://api.vturb.com.br" />
    </>
  );
}
