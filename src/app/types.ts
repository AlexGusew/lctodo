export interface TodoItem {
  id: string;
  title: string;
  done: boolean;
  date?: Date;
  difficulty?: Question["difficulty"];
  tags: string[];
}

export interface Question {
  QID: string;
  title: string;
  titleSlug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topicTags: string[];
}
