from flask import Blueprint, request, jsonify
from models.complaint import db, Complaint

complaint_bp = Blueprint("complaint_bp", __name__)


# Create a new complaint
@complaint_bp.route("/api/complaints", methods=["POST"])
def create_complaint():
    data = request.get_json()

    complaint = Complaint(
        title=data["title"],
        category=data["category"],
        priority=data["priority"],
        location=data["location"],
        description=data["description"]
    )

    db.session.add(complaint)
    db.session.commit()

    return jsonify({
        "message": "Complaint submitted successfully",
        "complaint_id": complaint.id
    }), 201


# Get all complaints with optional filters
@complaint_bp.route("/api/complaints", methods=["GET"])
def get_complaints():
    status = request.args.get("status")
    priority = request.args.get("priority")
    category = request.args.get("category")

    query = Complaint.query

    if status:
        query = query.filter_by(status=status)

    if priority:
        query = query.filter_by(priority=priority)

    if category:
        query = query.filter_by(category=category)

    complaints = query.all()

    result = []

    for complaint in complaints:
        result.append({
            "id": complaint.id,
            "title": complaint.title,
            "category": complaint.category,
            "priority": complaint.priority,
            "location": complaint.location,
            "description": complaint.description,
            "status": complaint.status
        })

    return jsonify(result), 200


# Update complaint status
@complaint_bp.route("/api/complaints/<int:complaint_id>/status", methods=["PUT"])
def update_complaint_status(complaint_id):
    complaint = Complaint.query.get(complaint_id)

    if complaint is None:
        return jsonify({
            "message": "Complaint not found"
        }), 404

    data = request.get_json()
    new_status = data.get("status")

    allowed_statuses = [
        "Pending",
        "In Progress",
        "Resolved",
        "Closed"
    ]

    if new_status not in allowed_statuses:
        return jsonify({
            "message": "Invalid status",
            "allowed_statuses": allowed_statuses
        }), 400

    complaint.status = new_status
    db.session.commit()

    return jsonify({
        "message": "Complaint status updated successfully",
        "complaint_id": complaint.id,
        "status": complaint.status
    }), 200


# Analytics
@complaint_bp.route("/api/analytics", methods=["GET"])
def get_analytics():
    complaints = Complaint.query.all()

    total = len(complaints)

    pending = sum(1 for c in complaints if c.status == "Pending")
    in_progress = sum(1 for c in complaints if c.status == "In Progress")
    resolved = sum(1 for c in complaints if c.status == "Resolved")
    closed = sum(1 for c in complaints if c.status == "Closed")

    category_counts = {}

    for complaint in complaints:
        category = complaint.category
        category_counts[category] = category_counts.get(category, 0) + 1

    priority_counts = {}

    for complaint in complaints:
        priority = complaint.priority
        priority_counts[priority] = priority_counts.get(priority, 0) + 1

    return jsonify({
        "total_complaints": total,
        "status": {
            "pending": pending,
            "in_progress": in_progress,
            "resolved": resolved,
            "closed": closed
        },
        "by_category": category_counts,
        "by_priority": priority_counts
    }), 200