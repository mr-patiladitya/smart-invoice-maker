# utils/num_to_words.py
def num_to_indian_words(number):
    import inflect
    p = inflect.engine()
    words = p.number_to_words(int(round(number)), andword='', zero='zero')
    return words.title() + " Rupees Only"
