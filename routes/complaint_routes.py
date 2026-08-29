from flask import Blueprint, request, jsonify
from models.complaint import db, Complaint

complaint_bp = Blueprint("complaint_bp", __name__)


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