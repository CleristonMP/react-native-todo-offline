import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import Task from '../components/Task';
import Icon from 'react-native-vector-icons/FontAwesome';
import commonStyles from '../commonStyles';
import 'moment/locale/pt-br';
import moment from 'moment';
import AddTask from './AddTask';
import {TaskType} from '../types/task-type';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export default class TaskList extends Component {
  state = {
    showDoneTasks: true,
    showAddTask: false,
    visibleTasks: [],
    tasks: [
      {
        id: Math.random(),
        desc: 'Compra livro',
        estimateAt: new Date(),
        doneAt: new Date(),
      },
      {
        id: Math.random(),
        desc: 'Ler livro',
        estimateAt: new Date(),
        doneAt: null,
      },
    ],
  };

  componentDidMount = () => {
    this.filterTasks();
  };

  toggleFilter = () => {
    this.setState({showDoneTasks: !this.state.showDoneTasks}, this.filterTasks);
  };

  filterTasks = () => {
    let visibleTasks = null;
    if (this.state.showDoneTasks) {
      visibleTasks = [...this.state.tasks];
    } else {
      const pending = (task: any) => task.doneAt === null;
      visibleTasks = this.state.tasks.filter(pending);
    }

    this.setState({visibleTasks});
  };

  toggleTask = (taskId: number) => {
    const tasks = [...this.state.tasks];
    tasks.forEach(task => {
      if (task.id === taskId) {
        task.doneAt = task.doneAt ? null : new Date();
      }
    });
    this.setState({tasks}, this.filterTasks);
  };

  addTask = ({task}: any) => {
    if (!task.desc || !task.desc.trim()) {
      Alert.alert('Dados Inválidos', 'Descrição não informada!');
      return;
    }

    const tasks = [...this.state.tasks];
    tasks.push({
      id: Math.random(),
      desc: task.desc,
      estimateAt: task.estimateAt,
      doneAt: null,
    });

    this.setState({tasks, showAddTask: false}, this.filterTasks);
  };

  deleteTask = (id: number) => {
    const tasks = this.state.tasks.filter(task => task.id !== id);
    this.setState({tasks}, this.filterTasks);
  };

  render() {
    const today = moment().locale('pt-br').format('ddd, D [de] MMMM');
    return (
      <View style={styles.container}>
        <AddTask
          isVisible={this.state.showAddTask}
          onCancel={() => this.setState({showAddTask: false})}
          onSave={this.addTask}
        />
        <ImageBackground
          source={require('../../assets/imgs/today.jpg')}
          style={styles.background}>
          <View style={styles.iconBar}>
            <TouchableOpacity onPress={this.toggleFilter}>
              <Icon
                name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}
                size={20}
                color={commonStyles.colors.secondary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.titleBar}>
            <Text style={styles.title}>Hoje</Text>
            <Text style={styles.subtitle}>{today}</Text>
          </View>
        </ImageBackground>
        <View style={styles.taskList}>
          <GestureHandlerRootView>
            <FlatList
              data={this.state.visibleTasks}
              keyExtractor={(item: TaskType) => item.id.toString()}
              renderItem={({item}) => (
                <Task
                  {...item}
                  onToggleTask={this.toggleTask}
                  onDelete={this.deleteTask}
                />
              )}
            />
          </GestureHandlerRootView>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.7}
          onPress={() => this.setState({showAddTask: true})}>
          <Icon name="plus" size={20} color={commonStyles.colors.secondary} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 3,
  },
  taskList: {
    flex: 7,
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 50,
    marginLeft: 20,
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 30,
  },
  iconBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'flex-end',
    marginTop: Platform.OS === 'ios' ? 40 : 10,
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: commonStyles.colors.today,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
