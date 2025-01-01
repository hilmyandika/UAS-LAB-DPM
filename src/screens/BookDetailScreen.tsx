import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { fetchBook, createBook, updateBook } from '../services/api';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Book } from '../types/index';

const BookDetailScreen = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = (route.params as { id?: string }) || {};

  useEffect(() => {
    if (id) {
      const loadBook = async () => {
        const book: Book = await fetchBook(id);
        setTitle(book.title);
        setAuthor(book.author);
        setGenre(book.genre);
        setDescription(book.description);
        setTotalPages(book.totalPages.toString());
      };
      loadBook();
    }
  }, [id]);

  const handleSave = async () => {
    try {
      const bookData = { title, author, genre, description, totalPages: parseInt(totalPages, 10) };
      if (id) {
        await updateBook(id, bookData);
      } else {
        await createBook(bookData);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        value={genre}
        onChangeText={setGenre}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Total Pages"
        value={totalPages}
        onChangeText={setTotalPages}
        keyboardType="numeric"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ff6347',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookDetailScreen;
