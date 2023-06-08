export interface Dataset {
  name: string;
  createdAt: string;
  updatedAt: string;
  userIds: string[];
  datasetStatistics: DatasetStatistics[];
}

export interface DatasetStatistics {
  userId: number;
  datasetName: string;
  moderatingTime: number;
}
