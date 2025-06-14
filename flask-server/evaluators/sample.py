from preprocessor.word2vec_singleton import get_word2vec_model

# Load the model using singleton class
model = get_word2vec_model()

# Essay and prompt input
essay_text = """I like flowers because they are pretty."""

prompt_text = """Why do you like flowers?"""

# clean
def tokenize(text):
    return [w.strip(".,!?\"'()").lower() for w in text.split()]

essay_words = tokenize(essay_text)
prompt_words = tokenize(prompt_text)

# Function to print vectors
def print_vectors(words, label, model):
    print(f"\n--- {label.upper()} WORD VECTORS ---")
    for word in words:
        if word in model.key_to_index:
            vector = model[word]
            print(f"{word}: {vector[:5]}...")  
        else:
            print(f"{word}: [NOT IN VOCAB]")

# Print essay and prompt word vectors
print_vectors(essay_words, "essay", model)
print_vectors(prompt_words, "prompt", model)