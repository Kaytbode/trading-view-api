HOW TO USE THE BACKEND SERVER 

Installation 
You must have node installed on your machine to be able to successfully follow these instructions.
 - On the command line, navigate to the project root folder.
 - Type "npm install" and press enter to install the server dependencies.
 - Type "npm start" and press enter to start the node server.
 - On your browser, go to the URL "localhost:3000" to view the API output for the home page.

Usage
How to request for helkin Ashi and Momentum output for an asset.

For example, to get the output for the 'SOLUSDT' asset, send an HTTP GET request

'/api/ham/SOLUSDT?tf[]=1S' - This request is for the 1 second timeframe.

'/api/ham/SOLUSDT?tf[]=5' - This request is for the 5 minutes timeframe.

'/api/ham/SOLUSDT?tf[]=1440' - This request is for the daily timeframe.

'/api/ham/SOLUSDT?tf=5&tf=15&tf=30' - This request is for multiple timeframes (5, 15, 30 minutes).

For the pulse timeframes
- 1 - 25 (1 minute to 25 minutes)

- 30 - 600 (30 minutes to 10 hours)

- 720 - 8640 (12 hours to 6 days)

- 10080 - 241920 (1 week to 24 weeks )


How to request for the Change Analysis output for an asset.

For example, to get the output for the 'SOLUSDT' asset, send an HTTP GET request

'/api/ca/SOLUSDT?tf[]=5' - This request is for the 5 minutes timeframe.

'/api/ca/SOLUSDT?tf[]=60' - This request is for the hourly timeframe.

'/api/ca/SOLUSDT?tf[]=1d' - This request is for the daily timeframe.

'/api/ca/SOLUSDT?tf=5&tf=15&tf=30' - This request is for multiple timeframes (5, 15, 30 minutes).

For the shift timeframes,
- 1 - 500 minutes ( you specify in minutes )

- '12h', '1d', '3d', '1w', '1M' ( these are the other queries permitted )


For example, to add the asset 'SOLUSDT' to the watchlist, send an HTTP POST request

'/api/watchlist/SOLUSDT' - adds 'SOLUSDT' to the watchlist

For example, to remove the asset 'SOLUSDT' from the watchlist, send an HTTP DELETE request

'/api/watchlist/SOLUSDT' - removes 'SOLUSDT' from the watchlist

To get the rise and fall,
-1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M (supported timeframes)

For example, to get the rise and fall for the asset 'SOLUSDT' and timeframe '5m', send an HTTP GET request

'/api/rf/SOLUSDT?tf=5m'


For example, to view the assets on the watchlist, send an HTTP GET request

'/api/watchlist/3?pulse=1&pulse=15&shift=2&shift=5&wltf=15' 

This request has four(4) parameters specified.
1. the sort type, which is denoted by 3.
2. the pulse timeframes(pulse) needed to calculate the pulse value
3. the shift timeframes(shift) needed to calculate the shift value
4. the watchlist timeframe (wltf) for sorting the assets.

if the (wltf) is not specified, the assets are sorted by average change analysis of the shift timeframes.

sort type 1 - (3, 2, 1, 0, -1, -2, -3)
sort type 2 - (-3, -2, -1, 0, 1, 2, 3)
sort type 3 - (3, -3, 2, -2, 1, -1, 0)
sort type 4 - (-3, 3, -2, 2, -1, 1, 0)