from services.events_service import delete_event_by_id

def delete_task_by_id(task_id):
    """Delete a task by its ID."""
    try:
        if delete_event_by_id(task_id):
            return {"status": "success", "message": "Task deleted successfully."}
        else:
            return {"status": "error", "message": "Task not found."}
    except Exception as e:
        return {"status": "error", "message": str(e)}
