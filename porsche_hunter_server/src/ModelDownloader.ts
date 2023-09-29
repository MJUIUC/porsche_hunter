import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

async function autoScroll(page: any) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const scrollDelay = 100;

      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, scrollDelay);
    });
  });
}

const fetchImages = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.porsche.com/usa/models/');

  // Scroll to the bottom of the page to load all images
  await autoScroll(page);

  // Get the page content with all images loaded
  const pageContent = await page.content();

  // Load the page content into Cheerio
  const $ = cheerio.load(pageContent);

  // Extract image URLs and alt text
  const images: { url: string; alt: string }[] = [];
  $('img').each((index, element) => {
    const imageUrl = $(element).attr('data-image-src');
    const altText = $(element).attr('alt');
    if (imageUrl && altText) {
      images.push({ url: imageUrl, alt: altText });
    }
  });

  // Close the browser
  await browser.close();

  // Print the extracted images
  return images;
};

const saveImages = async () => {
    const images = await fetchImages();
    
    const formattedImageObjs = images.map((image, index) => {
        const url = image.url;
        const alt = image.alt;
        const altSplit = alt.split(' ');
        const model = altSplit.slice(0, 2).join(' ');
        const trim = altSplit.slice(2).join(' ');
        return {
            url,
            alt,
            model,
            trim
        };
    });

    // fs.writeFileSync('./src/porsche_models.json', JSON.stringify(formattedImageObjs, null, 2));
};

// Uncomment to run
// saveImages();
