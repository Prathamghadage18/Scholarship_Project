// teacherSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialTeacherState = {
  subjects: [],
  classes: [],
};

const teacherSlice = createSlice({
  name: "teacher",
  initialState: initialTeacherState,
  reducers: {
    setSubjects: (state, action) => {
      state.subjects = action.payload;
    },
    setClasses: (state, action) => {
      state.classes = action.payload;
    },
    clearTeacherData: (state) => {
      state.subjects = [];
      state.classes = [];
    },
  },
});

const initialSchoolState = {
  schoolCode: [],
};

const schoolSlice = createSlice({
  name: "school",
  initialState: initialSchoolState,
  reducers: {
    setSchoolCode: (state, action) => {
      state.schoolCode = action.payload;
    },
    clearSchoolData: (state) => {
      state.schoolCode = [];
    },
  },
});

// Actions
export const { setSubjects, setClasses, clearTeacherData } = teacherSlice.actions;
export const { setSchoolCode, clearSchoolData } = schoolSlice.actions;

// Reducers
export const teacherReducer = teacherSlice.reducer;
export const schoolReducer = schoolSlice.reducer;
