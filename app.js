const express = require('express');
const { header } = require('express/lib/request');
const path = require('path');
const puppeteer = require('puppeteer-extra')
const axios = require('axios');
const { response } = require('express');
const got = require('got');


const app = express();

const PORT = 8999;

//middleware
app.use(express.static("public"));
app.use(express.json());
//app.use(express.json);


app.get("/", (req, res) => {
   res.send("Hello, mate");
});

app.post("/amazon", async (req, res) => {
   console.log('amazon')

   const browser = await puppeteer.launch({ headless: true });
   const page = await browser.newPage();
   
	await page.goto(req.body.link);

      const amPrice = await page.evaluate(() => {
      try {
         let price = document.querySelector('#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center > span.a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay > span.a-offscreen').innerText;
         return price;
      } catch (error) {
         console.log(error);
         return "";
      }
   });

   const amTitulo = await page.evaluate(() => {
      try {
         let titulo = document.querySelector('#productTitle').innerText;
         return titulo;
      } catch (error) {
         console.log(error);
         return "";
      }
   })

   const amPrecoAntigo = await page.evaluate(() => {
      try {
         let precoAntigo = document.querySelector('#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-small.aok-align-center > span > span.a-size-small.a-color-secondary.aok-align-center.basisPrice > span > span.a-offscreen').innerText;
         return precoAntigo;
      } catch (error) {
         console.log(error);
         return "";
      }
   })

   const amProductID = await page.evaluate(() => {
      try {
         let productID = document.querySelector('#ASIN').getAttribute('value');
         return productID;
      } catch (error) {
         console.log(error);
         return "";
      }
   })

   var amShortenLink = await shortLinkAmz(amProductID);

   await browser.close();

   amResult = {
      'preco': amPrice,
      'titulo': amTitulo,
      'precoAntigo': amPrecoAntigo,
      'link': amShortenLink,
      'fretegratis': "sim"
   }

   res.json(amResult);

});


app.post("/magalu", async (req, res) => {
   console.log('magalu')

   const browser = await puppeteer.launch({ headless: true });
   const page = await browser.newPage();
   await page.goto(req.body.link);

   const mgPrice = await page.evaluate(() => {
      let price = document.querySelector('div.product-info-container > div.info > div > strong').innerText;
      return price;
   });

   const mgTitulo = await page.evaluate(() => {
      let titulo = document.querySelector('#pdetail > div.wrapper > div > div.product > h3').firstChild.textContent.trim();
      console.log(titulo)
      return titulo;
   })

   const mgPrecoAntigo = "";

   const mgProductID = await page.evaluate(() => {
      let productID = document.querySelector('div > div.similar-content > div.g-items.first > div').getAttribute('data-sku');
      return productID;
   })

   var mgShortenLink = await shortLinkMag(mgProductID);

   await browser.close();

   mgResult = {
      'preco': mgPrice,
      'titulo': mgTitulo,
      'precoAntigo': mgPrecoAntigo,
      'link': mgShortenLink
   }
   res.json(mgResult);

});


app.post("/americanas", async (req, res) => {
   console.log('americanas')

   const browser = await puppeteer.launch({ headless: false });
   const page = await browser.newPage();
   await page.goto(req.body.link);



   const amPrice = await page.evaluate(() => {
      try {
         let price = document.querySelector('#rsyswpsdk > div > main > div.src__Container-sc-dda50e-0.keeEeC > div.product-offer__Container-sc-1xm718r-0.knpcH > div.new__Wrapper-sc-1xcw1we-0.ewIMXf > div.best-price__PriceWrapper-sc-sqiicq-4.VBWlB > div').innerText;
         return price;
      } catch (error) {
         console.log(error);
         return "";

      }
   });



   const amTitulo = await page.evaluate(() => {
      try {
         let titulo = document.querySelector('#rsyswpsdk > div > main > div.src__Container-sc-dda50e-0.keeEeC > div.product-info__Container-sc-1u2zqg7-3.ctBVej > div.product-info__ProductInfoContainer-sc-1u2zqg7-4.hMlJbN > div:nth-child(2) > h1').firstChild.textContent.trim();

         return titulo;
      } catch (error) {
         console.log(error);
         return "";

      }
   })




   const amPrecoAntigo = await page.evaluate(() => {
      try {
         let preco = document.querySelector('#rsyswpsdk > div > main > div.src__Container-sc-dda50e-0.keeEeC > div.product-offer__Container-sc-1xm718r-0.knpcH > div.new__Wrapper-sc-1xcw1we-0.ewIMXf > div.best-price__ListPriceWrapper-sc-sqiicq-1.kVuCev > span').firstChild.textContent.trim();

         return preco;
      } catch (error) {
         console.log(error);
         return "";

      }
   })


   var amShortenLink = await shortLinkAmericanas(req.body.link);

   await browser.close();

   amResult = {
      'preco': amPrice,
      'titulo': amTitulo,
      'precoAntigo': amPrecoAntigo,
      'link': amShortenLink
   }
   res.json(amResult);

});

app.post("/submarino", async (req, res) => {
   console.log('submarino')

   const browser = await puppeteer.launch({ headless: false });
   const page = await browser.newPage();
   await page.goto(req.body.link);



   const smPrice = await page.evaluate(() => {
      try {
         let price = document.querySelector('#rsyswpsdk > div > main > div.src__Container-sc-1gt98wm-3.dpDJgV > div.src__ProductOffer-sc-1gt98wm-6.bBUhSs > div.src__Wrapper-sc-metkak-0.ciFuJi > div.src__PriceWrapper-sc-1jnodg3-4.bEcKVo > div').innerText;
         return price;
      } catch (error) {
         console.log(error);
         return "";

      }
   });
   
   const smTitulo = await page.evaluate(() => {
      try {
         let titulo = document.querySelector('#rsyswpsdk > div > main > div.src__Container-sc-1gt98wm-3.dpDJgV > div.src__ProductInfo-sc-1gt98wm-5.fEnHYp > div:nth-child(2) > h1').firstChild.textContent.trim();

         return titulo;
      } catch (error) {
         console.log(error);
         return "";

      }
   })

 const smPrecoAntigo = await page.evaluate(() => {
      try {
         let preco = document.querySelector('#rsyswpsdk > div > main > div.src__Container-sc-1gt98wm-3.dpDJgV > div.src__ProductOffer-sc-1gt98wm-6.bBUhSs > div.src__Wrapper-sc-metkak-0.ciFuJi > div.src__ListPriceWrapper-sc-1jnodg3-1.hSLaYv > span').innerHTML.trim();
         let a = preco.replace(/[!< >-]/g,'');
         return a;
      } catch (error) {
         console.log(error);
         return "";

      }
   })


   var smShortenLink = await shortLinkAmericanas(req.body.link);

   await browser.close();

   smResult = {
      'preco': smPrice,
      'titulo': smTitulo,
      'precoAntigo': smPrecoAntigo,
      'link': smShortenLink
   }
   try {
	res.json(smResult);
} catch (error) {
   res.json({error: 'not found'})
	
}

});


app.post("/casasbahia", async (req, res) => {
   console.log('casasbahia')

   const browser = await puppeteer.launch({ headless: false });
   const page = await browser.newPage();
   await page.goto(req.body.link);



   const amPrice = await page.evaluate(() => {
      try {
         let price = document.querySelector('#product-price').innerText;
         return price;
      } catch (error) {
         console.log(error);
         return "";

      }
   });



   const amTitulo = await page.evaluate(() => {
      try {
         let titulo = document.querySelector('#__next > div > div.css-1136qjt.eym5xli0 > div.css-1qm1lh.eym5xli0').firstChild.textContent.trim();

         return titulo;
      } catch (error) {
         console.log(error);
         return "";

      }
   })




   const amPrecoAntigo = await page.evaluate(() => {
      try {
         let preco = document.querySelector('#rsyswpsdk > div > main > div.src__Container-sc-dda50e-0.keeEeC > div.product-offer__Container-sc-1xm718r-0.knpcH > div.new__Wrapper-sc-1xcw1we-0.ewIMXf > div.best-price__ListPriceWrapper-sc-sqiicq-1.kVuCev > span').firstChild.textContent.trim();

         return preco;
      } catch (error) {
         console.log(error);
         return "";

      }
   })


   var amShortenLink = await shortLinkCasasBahia(req.body.link);

   await browser.close();

   amResult = {
      'preco': amPrice,
      'titulo': amTitulo,
      'precoAntigo': amPrecoAntigo,
      'link': amShortenLink
   }
   res.json(amResult);

});

app.post("/kabum", async (req, res) => {
   console.log('kabum')

   const browser = await puppeteer.launch({ headless: false });
   const page = await browser.newPage();
   await page.goto('' + req.body.link);



   const amPrice = await page.evaluate(() => {
      try {
         let price = document.querySelector('#blocoValores > div.sc-e4612f91-3.cFkEDy > div.sc-e4612f91-1.fpeVbY > h4').innerText;
         return price;
      } catch (error) {
         console.log(error);
         return "";

      }
   });



   const amTitulo = await page.evaluate(() => {
      try {
         let titulo = document.querySelector('#__next > main > article > section > div.sc-gYpcnp.fFqZQH.container-purchase > div:nth-child(1) > div > h1').firstChild.textContent.trim();

         return titulo;
      } catch (error) {
         console.log(error);
         return "";

      }
   })




   const amPrecoAntigo = await page.evaluate(() => {
      try {
         let preco = document.querySelector('#blocoValores > div.sc-e4612f91-3.cFkEDy > div.sc-e4612f91-1.fpeVbY > span.sc-d6a30908-0.jkcjaC.oldPrice').firstChild.textContent.trim();

         return preco;
      } catch (error) {
         console.log(error);
         return "";

      }
   })


   var amShortenLink = await shortLinkCasasBahia(req.body.link);

   await browser.close();

   amResult = {
      'preco': amPrice,
      'titulo': amTitulo,
      'precoAntigo': amPrecoAntigo,
      'link': amShortenLink,
      'fretegratis': "sem",
   }
   res.json(amResult);

});

app.post("/error", async (req, res) => {
   result = {
      'preco': 'invalido',
      'titulo': 'invalido',
      'precoAntigo': 'invalido',
      'link': 'invalido'
   }
   try {
	res.json(result);
} catch (error) {
   res.json({error: 'not found'})
	
}
});




async function shortLinkAmz(id) {
   const options = {
      method: 'POST',
      url: 'https://api.short.io/links',
      headers: {
         authorization: '',
      },
      json: {
         originalURL: `https://www.amazon.com.br/dp/${id}?&linkCode=ll1&tag=hadesplays08-20&linkId=aae8ef16ac32f2dd1acabddeb7667dcc&language=pt_BR&ref_=as_li_ss_tl`,
         domain: 'hdsplys.link'
      },
      responseType: 'json'
   };

   await got(options).then(response => {
      link = response.body['shortURL'];
   });

   return link;

}

async function shortLinkAmericanas(id) {
   const options = {
      method: 'POST',
      url: 'https://api.short.io/links',
      headers: {
         authorization: '',
      },
      json: {
         originalURL: `https://www.awin1.com/cread.php?awinmid=22193&awinaffid=1044885&platform=dl&ued=${id}`,
         domain: 'hdsplys.link'
      },
      responseType: 'json'
   };

   await got(options).then(response => {
      link = response.body['shortURL'];
   });

   return link;

}

async function shortLinkCasasBahia(id) {
   const options = {
      method: 'POST',
      url: 'https://api.short.io/links',
      headers: {
         authorization: '',
      },
      json: {
         originalURL: `https://www.awin1.com/cread.php?awinmid=17729&awinaffid=783157&ued=${id}`,
         domain: 'hdsplys.link'
      },
      responseType: 'json'
   };

   await got(options).then(response => {
      link = response.body['shortURL'];
   });

   return link;

}


async function shortLinkMag(id) {
   const options = {
      method: 'POST',
      url: 'https://api.short.io/links',
      headers: {
         authorization: '',
      },
      json: {
         originalURL: `https://www.magazinevoce.com.br/magazinehadesplays/p/${id}`,
         domain: 'hdsplys.link'
      },
      responseType: 'json'
   };

   await got(options).then(response => {
      link = response.body['shortURL'];
   });

   return link;

}

async function shortLinkKabum(id) {
   const options = {
      method: 'POST',
      url: 'https://api.short.io/links',
      headers: {
         authorization: '',
      },
      json: {
         originalURL: `https://www.awin1.com/cread.php?awinaffid=783157&awinmid=17729&platform=dl&ued=${id}`,
         domain: 'hdsplys.link'
      },
      responseType: 'json'
   };

   await got(options).then(response => {
      link = response.body['shortURL'];
   });

   return link;

}

app.listen(PORT, "192.168.0.100", () => {
   console.log(`RUNNING ON PORT ${PORT}`);
});


