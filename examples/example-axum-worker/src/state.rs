use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use uuid::Uuid;

use crate::todos::TodoItem;

#[derive(Debug, Clone, Default)]
pub struct AppState {
    pub todos: Arc<Mutex<HashMap<Uuid, TodoItem>>>,
}
