import scrapy
from scrapy.http import FormRequest
from ..items import Product

class FreeRideSpider(scrapy.Spider):
    name = 'freeride'
    allowed_domains = ['freeride-surfwear.fr']

    def __init__(self, *args, **kwargs):
        super(FreeRideSpider, self).__init__(*args, **kwargs)
        self.start_urls = [kwargs.get('start_url')]

    def parse(self, response):
        item = Product()
        item['image'] = 'http://www.freeride-surfwear.fr' + response.css('#zoomImg0Grande::attr(href)').extract_first()[2:]
        item['name'] = response.css('.fiche-article_designation ::text').extract_first().strip().split(' ', 1)[1]
        request = FormRequest(
                url='http://www.freeride-surfwear.fr/ajax/ajax_calculfichearticle.php',
                method='POST',
                headers={'Cookie': response.headers.getlist('Set-Cookie')},
                formdata={'qte': '1', 'variante': 'A', 'article': '6864'},
                callback=self.parseAjax)
        request.meta['item'] = item

        yield request

    def parseAjax(self, response):
        item = response.meta['item']
        item['price'] = response.css('#prixfinale ::text').extract_first().split('##')[0]

        yield item
