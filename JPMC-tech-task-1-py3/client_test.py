import unittest
from client3 import getDataPoint, getRatio


class ClientTest(unittest.TestCase):
  def test_getDataPoint_calculatePrice(self):
    quotes = [
      {'top_ask': {'price': 121.2, 'size': 36}, 'timestamp': '2019-02-11 22:06:30.572453', 'top_bid': {'price': 120.48, 'size': 109}, 'id': '0.109974697771', 'stock': 'ABC'},
      {'top_ask': {'price': 121.68, 'size': 4}, 'timestamp': '2019-02-11 22:06:30.572453', 'top_bid': {'price': 117.87, 'size': 81}, 'id': '0.109974697771', 'stock': 'DEF'}
    ]
    """ ------------ Add the assertion below ------------ """
    # Check if getDataPoint function returns the correct tuple where top_ask > top_bid
    for quote in quotes:
      self.assertEqual(getDataPoint(quote), (quote['stock'], quote['top_bid']['price'], 
        quote['top_ask']['price'], (quote['top_ask']['price'] + quote['top_bid']['price'])/2))

  def test_getDataPoint_calculatePriceBidGreaterThanAsk(self):
    quotes = [
      {'top_ask': {'price': 119.2, 'size': 36}, 'timestamp': '2019-02-11 22:06:30.572453', 'top_bid': {'price': 120.48, 'size': 109}, 'id': '0.109974697771', 'stock': 'ABC'},
      {'top_ask': {'price': 121.68, 'size': 4}, 'timestamp': '2019-02-11 22:06:30.572453', 'top_bid': {'price': 117.87, 'size': 81}, 'id': '0.109974697771', 'stock': 'DEF'}
    ]
    """ ------------ Add the assertion below ------------ """
    # Check if getDataPoint function returns the correct tuple where top_ask > top_bid
    for quote in quotes:
      self.assertEqual(getDataPoint(quote), (quote['stock'], quote['top_bid']['price'],
        quote['top_ask']['price'], (quote['top_ask']['price'] + quote['top_bid']['price'])/2))

  """ ------------ Add more unit tests ------------ """
  def test_getRatio_calculateStockBZero(self):
    quotes = [
        {'top_ask': {'price': 119.2, 'size': 36}, 'timestamp': '2019-02-11 22:06:30.572453',
         'top_bid': {'price': 120.48, 'size': 109}, 'id': '0.109974697771', 'stock': 'ABC'},
        {'top_ask': {'price': 0, 'size': 4}, 'timestamp': '2019-02-11 22:06:30.572453',
            'top_bid': {'price': 0, 'size': 81}, 'id': '0.109974697771', 'stock': 'DEF'}
    ]
    # getRatio when price B is zero
    prices = {}
    for quote in quotes:
      price = getDataPoint(quote)[3]
      stock = getDataPoint(quote)[0]
      # Assign key value pair for ABC/DEF
      prices[stock] = price
    self.assertEqual(getRatio(prices["ABC"], prices["DEF"]), None)

  def test_getRatio_calculateStockAZero(self):
    quotes = [
        {'top_ask': {'price': 0, 'size': 36}, 'timestamp': '2019-02-11 22:06:30.572453',
          'top_bid': {'price': 0, 'size': 109}, 'id': '0.109974697771', 'stock': 'ABC'},
        {'top_ask': {'price': 121.68, 'size': 4}, 'timestamp': '2019-02-11 22:06:30.572453',
            'top_bid': {'price': 117.87, 'size': 81}, 'id': '0.109974697771', 'stock': 'DEF'}
    ]
    # getRatio when price A is zero
    prices = {}
    for quote in quotes:
      price = getDataPoint(quote)[3]
      stock = getDataPoint(quote)[0]
      # Assign key value pair for ABC/DEF
      prices[stock] = price
    self.assertEqual(getRatio(prices["ABC"], prices["DEF"]), 0)


if __name__ == '__main__':
    unittest.main()
