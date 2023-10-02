import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Task, Tasks } from '../tasks.model';
import * as FromApp from '../../store/app.reducer';
import * as FromBoard from '../store/board.reducer';
import { Tag } from '../tags.model';
import { Status as taskStatus } from '../tasks.model';

const selectBoardFeature = createFeatureSelector<FromBoard.State>('board');

type TagPercentage = { name: string; percentage: number };

export const selectTasks = (state: FromApp.AppState) => state.board.tasks;
export const selectUsers = (state: FromApp.AppState) => state.board.users;
export const selectTags = (state: FromApp.AppState) => state.board.tags;
export const selectBoardIsLoading = (state: FromApp.AppState) =>
  state.board.boardIsLoading;

export const selectTaskById = (itemId: number) =>
  createSelector(selectBoardFeature, (boardState: FromBoard.State) =>
    boardState.tasks.find((item: Task) => item.id === itemId)
  );

export const selectSortedTasksByStatus = createSelector(
  selectBoardFeature,
  (boardState: FromBoard.State): Tasks => sortTasksByStatus(boardState.tasks)
);

const sortTasksByStatus = (data: Task[]): Tasks => {
  const tasks: Tasks = {
    todo: [],
    doing: [],
    done: [],
  };

  for (const key in data) {
    const status = data[key].status;

    if (status === taskStatus.TODO) {
      tasks.todo.push(data[key]);
    } else if (status === taskStatus.DOING) {
      tasks.doing.push(data[key]);
    } else if (status === taskStatus.DONE) {
      tasks.done.push(data[key]);
    }
  }

  return tasks;
};

export const selectTagsByTask = (task: Task) =>
  createSelector(selectBoardFeature, (boardState: FromBoard.State) => {
    let currentTags: string[] = [];
    let tagsMap = boardState.tags;

    if (tagsMap.length && task?.tags.length) {
      task.tags.forEach((tag) => {
        const currentTag = getTag(tagsMap, tag);
        if (currentTag) {
          currentTags.push(currentTag.name);
        }
      });
    }
    return currentTags;
  });

const getTag = (tagsMap: Tag[], id: number): Tag | undefined => {
  return tagsMap.find((tag) => tag.id === id);
};

export const selectTagsPercentages = createSelector(
  selectBoardFeature,
  (boardState: FromBoard.State): TagPercentage[] => {
    const tagCount: any = {};
    let tasks = boardState.tasks.slice();
    let tags = boardState.tags.slice();

    // Count the occurrences of each tag
    tasks.forEach((task) => {
      task.tags.forEach((tag) => {
        if (tagCount[tag] !== undefined) {
          tagCount[tag]++;
        } else {
          tagCount[tag] = 1;
        }
      });
    });

    // Calculate the total number of tags
    const totalTags = tasks.reduce(
      (total, task) => total + task.tags.length,
      0
    );

    // Calculate the percentage of each tag
    const tagPercentage: { [name: string]: number } = {};
    for (const tag in tagCount) {
      if (tagCount.hasOwnProperty(tag)) {
        const percentage = (tagCount[tag] / totalTags) * 100;
        tagPercentage[tag] = Math.round(percentage);
      }
    }

    const tagNames = tags;
    const tagPercentageArray: TagPercentage[] = [];

    // Convert tagPercentage object into an array of objects
    for (const mapping of tagNames) {
      const { id, name } = mapping;
      if (tagPercentage.hasOwnProperty(id.toString())) {
        const percentage = tagPercentage[id.toString()];
        tagPercentageArray.push({ name, percentage });
        delete tagPercentage[id.toString()];
      }
    }

    return tagPercentageArray;
  }
);
