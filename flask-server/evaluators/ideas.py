import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk import word_tokenize, pos_tag
from nltk.corpus import wordnet
from nltk.stem import WordNetLemmatizer

class IdeasEvaluator:

    def __init__(self, word2vec_model, expand_topn=100, similarity_threshold=0.5):
        self._ensure_nltk_resources()
        self.model = word2vec_model
        self.expand_topn = expand_topn
        self.similarity_threshold = similarity_threshold
        self.lemmatizer = WordNetLemmatizer()

    def _ensure_nltk_resources(self):
        resources = [
            ("corpora/brown", "brown"),
            ("tokenizers/punkt", "punkt"),
            ("taggers/averaged_perceptron_tagger", "averaged_perceptron_tagger"),
            ("corpora/wordnet", "wordnet"),
            ("corpora/omw-1.4", "omw-1.4")
        ]
        for resource_path, resource_name in resources:
            try:
                nltk.data.find(resource_path)
            except LookupError:
                nltk.download(resource_name)

    def nltk_pos_to_wordnet(self, tag):
        if tag.startswith('J'):
            return wordnet.ADJ
        elif tag.startswith('V'):
            return wordnet.VERB
        elif tag.startswith('N'):
            return wordnet.NOUN
        elif tag.startswith('R'):
            return wordnet.ADV
        else:
            return wordnet.NOUN

    def preprocess(self, text):
        tokens = word_tokenize(text.lower())
        pos_tags = pos_tag(tokens)
        return [self.lemmatizer.lemmatize(word, self.nltk_pos_to_wordnet(pos)) for word, pos in pos_tags]

    def expand_theme_words(self, theme_words):
        expanded = set(theme_words)
        for word in theme_words:
            if word in self.model.key_to_index:
                similar_words = self.model.most_similar(word, topn=self.expand_topn)
                filtered = [w for w, sim in similar_words if sim >= self.similarity_threshold]
                expanded.update(filtered)
        return list(expanded)

    def expand_words(self, words):
        expanded = set(words)
        for word in words:
            if word in self.model.key_to_index:
                similar_words = self.model.most_similar(word, topn=self.expand_topn)
                filtered = [w for w, sim in similar_words if sim >= self.similarity_threshold]
                expanded.update(filtered)
        return list(expanded)

    def calculate_similarity(self, essay_text, prompt):
        essay_raw = self.preprocess(essay_text)
        prompt_raw = [word for word in prompt if word in self.model.key_to_index]

        essay_expanded = self.expand_words(essay_raw)
        prompt_expanded = self.expand_words(prompt_raw)

        essay_words = [word for word in essay_expanded if word in self.model.key_to_index]
        theme_words = [word for word in prompt_expanded if word in self.model.key_to_index]

        if not essay_words or not theme_words:
            return 0

        essay_vectors = np.array([self.model[word] for word in essay_words])
        theme_vectors = np.array([self.model[word] for word in theme_words])

        essay_avg_vector = np.mean(essay_vectors, axis=0)
        theme_avg_vector = np.mean(theme_vectors, axis=0)

        similarity = cosine_similarity([essay_avg_vector], [theme_avg_vector])[0][0]

        # Add heuristic boost
        boost = self.heuristic_boost(set(essay_raw), set(prompt))
        return min(1.0, float(similarity + boost))  # cap to 1.0

    def evaluate(self, essay_text, theme):
        theme_list = self.preprocess(theme)
        expanded_theme = self.expand_theme_words(theme_list)
        return self.calculate_similarity(essay_text, expanded_theme)

