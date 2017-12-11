import scrapy
from scrapy.http import FormRequest
from ..items import Product
from selenium import webdriver

class HawaiiSurfSpider(scrapy.Spider):
    name = 'hawaiisurf'
    allowed_domains = ['hawaiisurf.com']

    def __init__(self, *args, **kwargs):
        super(HawaiiSurfSpider, self).__init__(*args, **kwargs)
        self.start_urls = [kwargs.get('start_url')]

        #options = webdriver.ChromeOptions()
        #options.add_argument('headless')
        #self.driver = webdriver.Chrome(chrome_options=options)

    def parse(self, response):
        item = Product()

        item['name'] = response.xpath('//div[@id="espaceachatproduit"]//*[@itemprop="name"]/text()').extract_first().strip()
        item['image'] = response.xpath('//img[@itemprop="image"]/@src').extract_first()
        item['price'] = response.xpath('//*[@itemtype="http://schema.org/Offer"]//*[@itemprop="price"]/text()').extract_first().strip()

        #self.driver.get(response.url)
        #item['name'] = self.driver.find_element_by_xpath('//*[@itemtype="http://schema.org/Product"]/meta[@itemprop="name"]').get_attribute('content').strip()
        #item['image'] = self.driver.find_element_by_xpath('//*[@itemtype="http://schema.org/Product"]/meta[@itemprop="image"]').get_attribute('content')
        #item['price'] = self.driver.find_element_by_xpath('//*[@itemtype="http://schema.org/Offer"]/meta[@itemprop="price"]').get_attribute('content')

        #self.driver.close()

        yield item
