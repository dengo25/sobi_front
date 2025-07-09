export const extractImageUrls = (html) => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const imgs = temp.querySelectorAll('img');
  return Array.from(imgs).map((img) => img.getAttribute('src'));
};

export const findRemovedImages = (oldHtml, newHtml) => {
  const oldUrls = extractImageUrls(oldHtml);
  const newUrls = extractImageUrls(newHtml);
  return oldUrls.filter((url) => !newUrls.includes(url));
};
