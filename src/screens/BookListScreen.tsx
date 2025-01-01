import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchBooks, deleteBook } from '../services/api';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Book, RootStackParamList } from '../types/index';

const BookListScreen = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const loadBooks = async () => {
    const fetchedBooks = await fetchBooks();
    setBooks(fetchedBooks);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error('Book id is undefined');
      return;
    }
    await deleteBook(id);
    setBooks(books.filter((book) => book.id !== id));
  };

  return (
    <ImageBackground
      source={require('../../assets/backgroundBuku.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.author}>{item.author}</Text>
              <Text style={styles.genre}>{item.genre}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.totalPages}>Pages: {item.totalPages}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.buttonEdit}
                  onPress={() =>
                    navigation.navigate('BookDetail', { id: item.id })
                  }
                >
                  <Icon name="create-outline" size={16} color="#fff" />
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonDelete}
                  onPress={() => handleDelete(item.id)}
                >
                  <Icon name="trash-outline" size={16} color="#fff" />
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('BookDetail', {})}
        >
          <Icon name="add-circle-outline" size={18} color="#fff" />
          <Text style={styles.addButtonText}>Add New Book</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(240, 244, 248, 0.8)',
  },
  bookItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1c2938',
    marginBottom: 6,
  },
  author: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 4,
  },
  genre: {
    fontSize: 14,
    color: '#8395a7',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#8395a7',
    marginBottom: 10,
    lineHeight: 20,
  },
  totalPages: {
    fontSize: 14,
    color: '#95a5a6',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
  },
  buttonDelete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1591ea',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 10,
  },
});

export default BookListScreen;
