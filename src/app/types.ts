export interface TodoItem {
  id: string;
  title: string;
  done: boolean;
  date?: Date;
}

export interface Question {
  QID: string;
  title: string;
  titleSlug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topicTags: string[];
}
