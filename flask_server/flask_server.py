import requests
from datetime import datetime
from dateutil.parser import parse
from flask_cors import CORS
from urllib.parse import urljoin, quote
from markupsafe import escape
from flask import Flask, request, url_for, current_app

app = Flask(__name__)
CORS(app)

movie_genre = {}
tv_genre = {}

# TODO: 可能前端handle 500 Internal Server Error when send wrong query string
# TODO: 注意average vote保留最多两位小数，如果刚好是整数怎么办？
@app.before_first_request
def extract_genre():
    raw_movie_genre = requests.get("https://api.themoviedb.org/3/genre/movie/list?api_key=788c93d7dc54e946665b5958c8ff0a3a&language=en-US")
    raw_tv_genre = requests.get("https://api.themoviedb.org/3/genre/tv/list?api_key=788c93d7dc54e946665b5958c8ff0a3a&language=en-US")
    for data in raw_movie_genre.json()['genres']:
        key = data['id']
        val = data['name']
        movie_genre[key] = val
    
    for data in raw_tv_genre.json()['genres']:
        key = data['id']
        val = data['name']
        tv_genre[key] = val

    # print(movie_genre)

# @app.before_first_request
# def startup():
#     print('before first')

@app.route("/")
def hello_world():
    # return render_template('index.html')
    return current_app.send_static_file('index.html')

# @app.route("/image.tmdb.org/t/p/w500")
# @app.route("/w500")
# def image(path):
#     pass

@app.route("/api/movies")
def get_trending_movies():
    """Return 5 trending movie data

    Returns:
        str: title
        str: backdrop_path
        str: release_date
    """

    raw = requests.get("https://api.themoviedb.org/3/trending/movie/week?api_key=788c93d7dc54e946665b5958c8ff0a3a")
    response = {'results': []}
    for data in raw.json()['results'][:5]:
        instance = {}
        if 'title' in data and data['title']:
            instance['title'] = data['title']
        else:
            instance['title'] = ''
        if 'backdrop_path' in data and data['backdrop_path']:
            instance['backdrop_path'] = 'https://image.tmdb.org/t/p/w780' + data['backdrop_path']
        else:
            instance['backdrop_path'] = './static/img/movie-placeholder.jpg'
        if 'release_date' in data and data['release_date']:
            instance['release_date'] = datetime.strptime(data['release_date'], '%Y-%m-%d').strftime('%Y')
        else:
            instance['release_date'] = ''

        response['results'].append(instance)
        
    return response

@app.route("/api/tvs")
def get_trending_tvs():
    """Return 5 tv trending data

    Returns:
        str: name
        str: backdrop_path
        str: first_air_date
    """
    
    raw = requests.get("https://api.themoviedb.org/3/tv/airing_today?api_key=788c93d7dc54e946665b5958c8ff0a3a")
    response = {'results': []}
    for data in raw.json()['results'][:5]:
        instance = {}
        if 'name' in data and data['name']:
            instance['name'] = data['name']
        else:
            instance['name'] = ''
        if 'backdrop_path' in data and data['backdrop_path']:
            instance['backdrop_path'] = 'https://image.tmdb.org/t/p/w780' + data['backdrop_path']
        else:
            instance['backdrop_path'] = './static/img/movie-placeholder.jpg'
        if 'first_air_date' in data and data['first_air_date']:
            instance['first_air_date'] = datetime.strptime(data['first_air_date'], '%Y-%m-%d').strftime('%Y')
        else:
            instance['first_air_date'] = ''
        
        response['results'].append(instance)
        
    return response

@app.route('/api/search/movie/<search_query>')
def search_movie(search_query):
    """Return movie search results

    Args:
        search_query (string): search query escape space

    Returns:
        object: results {
            int: id
            str: title
            str: overview
            str: poster_path (be careful static path)
            str: release_date
            str: vote_average
            str: vote_count
            list of str: genres
        }
    """

    raw = requests.get("https://api.themoviedb.org/3/search/movie?api_key=788c93d7dc54e946665b5958c8ff0a3a&language=en-US&query=" \
        + quote(search_query) + "&page=1&include_adult=false")
    
    response = {'results': []}
    for data in raw.json()['results']:
        instance = parse_movie_data(data)

        response['results'].append(instance)

    return response

@app.route('/api/search/tv/<search_query>')
def search_tv(search_query):
    """Return tv search results

    Args:
        search_query (string): search query escape space

    Returns: object: results {
        int: id
        str: name
        str: overview
        str: poster_path (be careful static path)
        str: first_air_date
        str: vote_average
        str: vote_count
        list of str: genres
    }
    """

    raw = requests.get("https://api.themoviedb.org/3/search/tv?api_key=788c93d7dc54e946665b5958c8ff0a3a&language=en-US&query=" \
        + quote(search_query) + "&page=1&include_adult=false")
    
    response = {'results': []}
    for data in raw.json()['results']:
        instance = parse_tv_data(data)

        response['results'].append(instance)

    return response

@app.route('/api/search/multi/<search_query>')
def search_multi(search_query):
    """Return movie & tv search results but not include person such as Tom Cruise

    Args:
        search_query (string): search query escape space

    Returns: object: results {
        int: id
        str: name or title
        str: overview
        str: poster_path (be careful static path)
        str: poster_path or first_air_date
        str: vote_average
        str: vote_count
        list of str: genres
    }
    """

    raw = requests.get("https://api.themoviedb.org/3/search/multi?api_key=788c93d7dc54e946665b5958c8ff0a3a&language=en-US&query=" \
        + quote(search_query) + "&page=1&include_adult=false")
    
    response = {'results': []}
    for data in raw.json()['results']:
        if 'media_type' in data and data['media_type']:
            if data['media_type'] == 'movie':
                instance = parse_movie_data(data)
                response['results'].append(instance)
            elif data['media_type'] == 'tv':
                instance = parse_tv_data(data)
                response['results'].append(instance)
            else:
                print("person type find")
        else:
            print("media_type field not found, fail to add this instance.")

    return response

@app.route('/api/get/movie/detail/<movie_id>')
def movie_detail(movie_id):
    """Return movie details

    Args:
        movie_id (int): id of the detail movie

    Returns:
        int: id
        str: title
        int: runtime
        str: release_date
        list of str: spoken_languages
        str: vote_average
        str: vote_count
        str: poster_path
        str: backdrop_path
        list of str: genres
    """

    data = requests.get("https://api.themoviedb.org/3/movie/" \
        + quote(movie_id) + "?api_key=788c93d7dc54e946665b5958c8ff0a3a&language=en-US").json()

    response = {}
    if 'success' in data and not data['success']:
        return response
    else:
        response['id'] = data['id']
        if 'title' in data and data['title']:
            response['title'] = data['title']
        else:
            response['title'] = ''
        if 'runtime' in data and data['runtime']:
            response['runtime'] = data['runtime']
        else:
            response['runtime'] = 0
        if 'release_date' in data and data['release_date']:
            response['release_date'] = datetime.strptime(data['release_date'], '%Y-%m-%d').strftime('%Y')
        else:
            response['release_date'] = ''
        if 'spoken_languages' in data and data['spoken_languages']:
            response['spoken_languages'] = [tmp['english_name'] for tmp in data['spoken_languages']]
        else:
            response['spoken_languages'] = []
        if 'vote_average' in data and data['vote_average']:
            response['vote_average'] = str(data['vote_average'] / 2) + '/5'
        else:
            response['vote_average'] = ''
        if 'vote_count' in data and data['vote_count']:
            response['vote_count'] = str(data['vote_count'])
        else:
            response['vote_count'] = ''
        if 'poster_path' in data and data['poster_path']:
            response['poster_path'] = 'https://image.tmdb.org/t/p/w185' + data['poster_path']
        else:
            response['poster_path'] = './static/img/poster-placeholder.png'
        if 'backdrop_path' in data and data['backdrop_path']:
            response['backdrop_path'] = 'https://image.tmdb.org/t/p/w780' + data['backdrop_path']
        else:
            response['backdrop_path'] = './static/img/movie-placeholder.jpg'
        if 'genres' in data and data['genres']:
            response['genres'] = [tmp['name'] for tmp in data['genres']]
        else:
            response['genres'] = []
    
    return response

@app.route('/api/get/movie/credit/<movie_id>')
def movie_credit(movie_id):
    """Return at most 8 movie actor names and pics

    Args:
        movie_id (int): id of the search movie

    Returns:
        str: name
        str: profile_path
        str: charactor
    """

    raw = requests.get("https://api.themoviedb.org/3/movie/" \
        + quote(movie_id) + "/credits?api_key=788c93d7dc54e946665b5958c8ff0a3a&language=en-US")

    response = {'results': []}
    clean = raw.json()
    if 'success' in clean and not clean['success']:
        return response
    else:
        for data in raw.json()['cast'][:8]:
            instance = {}
            if 'name' in data and data['name']:
                instance['name'] = data['name']
            else:
                instance['name'] = ''
            if 'profile_path' in data and data['profile_path']:
                instance['profile_path'] = 'https://image.tmdb.org/t/p/w185' + data['profile_path']
            else:
                instance['profile_path'] = './static/img/person-placeholder.png'
            if 'character' in data and data['character']:
                instance['character'] = data['character']
            else:
                instance['character'] = ''
            
            response['results'].append(instance)

    return response

@app.route('/api/get/movie/review/<movie_id>')
def movie_review(movie_id):
    """Return at most 5 movie reviews

    Args:
        movie_id (int): id of the search movie

    Returns:
        str: username
        str: rating
        str: content
        str: created_at
    """
    
    raw = requests.get("https://api.themoviedb.org/3/movie/" \
        + quote(movie_id) + "/reviews?api_key=788c93d7dc54e946665b5958c8ff0a3a&language=en-US")

    response = {'results': []}
    clean = raw.json()
    if 'success' in clean and not clean['success']:
        return response
    else:
        for data in raw.json()['results'][:5]:
            instance = {}
            if 'author_details' in data and data['author_details']:
                author_details = data['author_details']
                if 'username' in author_details and author_details['username']:
                    instance['username'] = author_details['username']
                else:
                    instance['username'] = ''
                if 'rating' in author_details and author_details['rating']:
                    # instance['rating'] = str(author_details['rating'] / 2) + '/5'
                    instance['rating'] = str(float('%.1f' % (author_details['rating'] / 2))) + '/5'
                else:
                    instance['rating'] = ''
            else:
                instance['username'] = ''
                instance['rating'] = ''
            if 'content' in data and data['content']:
                instance['content'] = data['content']
            else:
                instance['content'] = ''
            if 'created_at' in data and data['created_at']:
                # instance['created_at'] = datetime.fromisoformat(data['created_at']).strftime('%Y')
                instance['created_at'] = str(parse(data['created_at']).date()).replace('-', '/')
            else:
                instance['created_at'] = ''
            
            response['results'].append(instance)
    
    return response

@app.route('/api/get/tv/detail/<tv_id>')
def tv_detail(tv_id):
    """Return tv details

    Args:
        tv_id (int): id of the detail tv

    Returns:
        str: backdrop_path
        list of int: episode_run_time
        str: first_air_date
        list of str: genres
        int: id
        str: name
        int: number_of_seasons
        str: overview
        str: poster_path
        list of str: spoken_languages
        str: vote_average
        str: vote_count
    """

    data = requests.get("https://api.themoviedb.org/3/tv/" \
        + quote(tv_id) + "?api_key=788c93d7dc54e946665b5958c8ff0a3a&language=en-US").json()

    response = {}
    if 'success' in data and not data['success']:
        return response
    else:
        response['id'] = data['id']
        if 'name' in data and data['name']:
            response['name'] = data['name']
        else:
            response['name'] = ''
        if 'number_of_seasons' in data and data['number_of_seasons']:
            response['number_of_seasons'] = data['number_of_seasons']
        else:
            response['number_of_seasons'] = 0
        if 'episode_run_time' in data and data['episode_run_time']:
            response['episode_run_time'] = data['episode_run_time']
        else:
            response['episode_run_time'] = []
        if 'overview' in data and data['overview']:
            response['overview'] = data['overview']
        else:
            response['overview'] = ''
        if 'first_air_date' in data and data['first_air_date']:
            response['first_air_date'] = datetime.strptime(data['first_air_date'], '%Y-%m-%d').strftime('%Y')
        else:
            response['first_air_date'] = ''
        if 'spoken_languages' in data and data['spoken_languages']:
            response['spoken_languages'] = [tmp['english_name'] for tmp in data['spoken_languages']]
        else:
            response['spoken_languages'] = []
        if 'vote_average' in data and data['vote_average']:
            response['vote_average'] = str(data['vote_average'] / 2) + '/5'
        else:
            response['vote_average'] = ''
        if 'vote_count' in data and data['vote_count']:
            response['vote_count'] = str(data['vote_count'])
        else:
            response['vote_count'] = ''
        if 'poster_path' in data and data['poster_path']:
            response['poster_path'] = 'https://image.tmdb.org/t/p/w185' + data['poster_path']
        else:
            response['poster_path'] = './static/img/poster-placeholder.png'
        if 'backdrop_path' in data and data['backdrop_path']:
            response['backdrop_path'] = 'https://image.tmdb.org/t/p/w780' + data['backdrop_path']
        else:
            response['backdrop_path'] = './static/img/movie-placeholder.jpg'
        if 'genres' in data and data['genres']:
            response['genres'] = [tmp['name'] for tmp in data['genres']]
        else:
            response['genres'] = []
    
    return response

@app.route('/api/get/tv/credit/<tv_id>')
def tv_credit(tv_id):
    """Return at most 8 tv actor names and pics

    Args:
        tv_id (int): id of the search tv

    Returns:
        str: name
        str: profile_path
        str: charactor
    """

    raw = requests.get("https://api.themoviedb.org/3/tv/" \
        + quote(tv_id) + "/credits?api_key=788c93d7dc54e946665b5958c8ff0a3a&language=en-US")

    response = {'results': []}
    clean = raw.json()
    if 'success' in clean and not clean['success']:
        return response
    else:
        for data in raw.json()['cast'][:8]:
            instance = {}
            if 'name' in data and data['name']:
                instance['name'] = data['name']
            else:
                instance['name'] = ''
            if 'profile_path' in data and data['profile_path']:
                instance['profile_path'] = 'https://image.tmdb.org/t/p/w185' + data['profile_path']
            else:
                instance['profile_path'] = './static/img/person-placeholder.png'
            if 'character' in data and data['character']:
                instance['character'] = data['character']
            else:
                instance['character'] = ''
            
            response['results'].append(instance)

    return response

@app.route('/api/get/tv/review/<tv_id>')
def tv_review(tv_id):
    """Return at most 5 tv reviews

    Args:
        tv_id (int): id of the search tv

    Returns:
        str: username
        str: rating
        str: content
        str: created_at
    """
    
    raw = requests.get("https://api.themoviedb.org/3/tv/" \
        + quote(tv_id) + "/reviews?api_key=788c93d7dc54e946665b5958c8ff0a3a&language=en-US")

    response = {'results': []}
    clean = raw.json()
    if 'success' in clean and not clean['success']:
        return response
    else:
        for data in raw.json()['results'][:5]:
            instance = {}
            if 'author_details' in data and data['author_details']:
                author_details = data['author_details']
                if 'username' in author_details and author_details['username']:
                    instance['username'] = author_details['username']
                else:
                    instance['username'] = ''
                if 'rating' in author_details and author_details['rating']:
                    # instance['rating'] = str(author_details['rating'] / 2) + '/5'
                    instance['rating'] = str(float('%.1f' % (author_details['rating'] / 2))) + '/5'
                else:
                    instance['rating'] = ''
            else:
                instance['username'] = ''
                instance['rating'] = ''
            if 'content' in data and data['content']:
                instance['content'] = data['content']
            else:
                instance['content'] = ''
            if 'created_at' in data and data['created_at']:
                # instance['created_at'] = datetime.fromisoformat(data['created_at']).strftime('%Y')
                instance['created_at'] = str(parse(data['created_at']).date()).replace('-', '/')
            else:
                instance['created_at'] = ''
            
            response['results'].append(instance)
    
    return response

def parse_movie_data(data):
    instance = {}
    instance['id'] = data['id']
    if 'title' in data and data['title']:
        instance['title'] = data['title']
    else:
        instance['title'] = ''
    if 'overview' in data and data['overview']:
        instance['overview'] = data['overview']
    else:
        instance['overview'] = ''
    if 'poster_path' in data and data['poster_path']:
        instance['poster_path'] = 'https://image.tmdb.org/t/p/w185' + data['poster_path']
    else:
        instance['poster_path'] = './static/img/poster-placeholder.png'
    if 'release_date' in data and data['release_date']:
        instance['release_date'] = datetime.strptime(data['release_date'], '%Y-%m-%d').strftime('%Y')
    else:
        instance['release_date'] = ''
    if 'vote_average' in data and data['vote_average']:
        instance['vote_average'] = str(data['vote_average'] / 2) + '/5'
    else:
        instance['vote_average'] = '0.0/5'
    if 'vote_count' in data and data['vote_count']:
        instance['vote_count'] = str(data['vote_count'])
    else:
        instance['vote_count'] = '0'
    try:
        instance['genres'] = [movie_genre[key] for key in data['genre_ids']]
    except KeyError:
        print("Fail to convert id to movie genres")
        instance['genres'] = []
    
    return instance

def parse_tv_data(data):
    instance = {}
    instance['id'] = data['id']
    if 'name' in data and data['name']:
        instance['name'] = data['name']
    else:
        instance['name'] = ''
    if 'overview' in data and data['overview']:
        instance['overview'] = data['overview']
    else:
        instance['overview'] = ''
    if 'poster_path' in data and data['poster_path']:
        instance['poster_path'] = 'https://image.tmdb.org/t/p/w185' + data['poster_path']
    else:
        instance['poster_path'] = './static/img/poster-placeholder.png'
    if 'first_air_date' in data and data['first_air_date']:
        instance['first_air_date'] = datetime.strptime(data['first_air_date'], '%Y-%m-%d').strftime('%Y')
    else:
        instance['first_air_date'] = ''
    if 'vote_average' in data and data['vote_average']:
        instance['vote_average'] = str(data['vote_average'] / 2) + '/5'
    else:
        instance['vote_average'] = '0.0/5'
    if 'vote_count' in data and data['vote_count']:
        instance['vote_count'] = str(data['vote_count'])
    else:
        instance['vote_count'] = '0'
    try:
        instance['genres'] = [tv_genre[key] for key in data['genre_ids']]
    except KeyError:
        print("Fail to convert id to tv genres")
        instance['genres'] = []
    
    return instance

if __name__ == '__main__':
    app.run()