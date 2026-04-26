const urls = [
  'https://drive.google.com/file/d/1vt1Bsic0U8WNHk1h9YpZ-vK9fg3ARTMs/view',
  'https://drive.google.com/file/d/1vt1Bsic0U8WNHk1h9YpZ-vK9fg3ARTMs/view?usp=sharing',
  'https://drive.google.com/open?id=1vt1Bsic0U8WNHk1h9YpZ-vK9fg3ARTMs',
  'https://drive.google.com/uc?id=1vt1Bsic0U8WNHk1h9YpZ-vK9fg3ARTMs&export=download',
  'https://drive.google.com/file/d/1vt1Bsic0U8WNHk1h9YpZ-vK9fg3ARTMs'
];

const getDirectImageUrl = (url) => {
    if (!url || typeof url !== 'string') return url
    if (url.includes('drive.google.com')) {
      const dMatch = url.match(/\/d\/([^/?#\s]+)/)
      let id = ''
      if (dMatch) id = dMatch[1]
      else {
        const idParamMatch = url.match(/[?&]id=([^&#\s]+)/)
        if (idParamMatch) id = idParamMatch[1]
      }
      
      if (id) {
        // Explicitly remove trailing /view or /edit if caught
        id = id.replace(/\/(view|edit|usp=sharing)$/, '')
        return `https://lh3.googleusercontent.com/d/${id}`
      }
    }
    return url
}

urls.forEach(u => console.log(`${u} => ${getDirectImageUrl(u)}`));
