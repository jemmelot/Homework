# Jesse Emmelot
# 11963522
#
# Converts a txt file to a csv, and csv to json

import csv
import json

txt_file = 'KNMI_20161231.txt'
csv_file = 'windspeeds.csv'
json_file = 'windspeeds.json'

days = []

# read txt file and format accordingly
with open(txt_file, 'rb') as in_file:
	reader = csv.reader(in_file)
	for row in reader:
		for i in range(len(row)):
			row[i] = row[i].strip()
		days.append([row[1], row[2]])

# write formatted data to csv file		
with open(csv_file, 'wb') as out_file:
	writer = csv.writer(out_file, delimiter = ",")
	for i in range(len(days)):
		writer.writerow(days[i])

# format the data from the csv to transport to json		
with open(csv_file) as in_csv:
	fieldnames = ("Date","Speed")
	reader = csv.DictReader(in_csv, fieldnames)
	rows = list(reader)

# write the final data to json file	
with open(json_file, 'w') as out_json:
    json.dump(rows, out_json)	

