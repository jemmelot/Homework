#!/usr/bin/env python
# Name: Jesse Emmelot
# Student number: 11963522
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # variables to store series info into
    all = []
    all_info = []
	
    # variables to control iteration parameters
    j = 0
    k = 1
    cap = 0
    index = 0
	
    # get information of the top 50 series
    while (cap < 50):
        # get information of the div class of a specific series
        for serie in dom('div.lister-item')[j:k]:
            # get the title
            for title in serie('h3.lister-item-header'):
                titles = title('a')[0].content
                all.append(titles)
			
            # get the rating			
            for rating in serie('div.inline-block'):
                for number in rating('strong'):
                    numbers = number.content
                    all.append(numbers)    
			
            # get the genre
            for genre in serie('span.genre'):
                genres = genre.content.strip()
                all.append(genres)

            # string to store actor names into	
            actor_list = ''		
			
            # get the actors
            for actors in serie('div.lister-item-content'):
                for test in actors('p')[2:3]:
                    for i in range(len(test('a'))):
                        buffer = test('a')[i].content
                        actor_list = actor_list + ', ' + buffer
                        actor_list = actor_list.lstrip(', ')
						
                    all.append(actor_list)
			
            # get the runtime
            for runtime in serie('span.runtime'):
                runtimes = runtime.content.strip('min')
                all.append(runtimes)
				
        j += 3
        k += 3
        cap += 1
				
    return all
	
def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # outputs the info of the top 50 series, also using the encode function to prevent unicode errors
    for i in range(0, 250, 5):
        line = []	
        info = [tvseries[i], tvseries[(i+1)], tvseries[(i+2)], tvseries[(i+3)], tvseries[(i+4)]]
        for row in zip(info):
            row=[s.encode('utf-8') for s in row]
            line.append(", ".join(row))			
        writer.writerow(line) 
    
if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)