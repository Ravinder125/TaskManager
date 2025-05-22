# Replacing bson.ObjectId with manual ID generation since bson is not available
from datetime import datetime, timedelta
import random
import uuid

# Sample data pools
titles = [
    "Redesign Landing Page", "Database Migration", "Performance Optimization",
    "Client Onboarding", "Security Audit"
]

descriptions = [
    "Revamp the UI and layout of the landing page based on the new branding guidelines.",
    "Move data from the legacy database to the new MongoDB schema.",
    "Improve the application performance by caching frequent queries.",
    "Guide the new client through system setup and first-use scenarios.",
    "Perform a comprehensive audit of the backend services for vulnerabilities."
]

todo_samples = [
    ["Create wireframes", "Get approval from design team", "Update components", "Test responsiveness", "Deploy changes"],
    ["Export data from old DB", "Transform data format", "Import into MongoDB", "Verify consistency", "Clean up legacy DB"],
    ["Identify slow endpoints", "Implement Redis caching", "Monitor response times", "Optimize DB queries", "Write benchmarks"],
    ["Schedule kickoff call", "Create onboarding docs", "Assign a customer success manager", "Provision access", "Collect feedback"],
    ["List all endpoints", "Run automated scans", "Fix major issues", "Review code for security flaws", "Prepare final report"]
]

attachment_samples = [
    ["design_specs.pdf", "branding_guide.png"],
    ["migration_plan.xlsx", "legacy_schema.sql"],
    ["benchmark_results.txt", "cache_metrics.csv"],
    ["onboarding_checklist.docx", "welcome_email_template.eml"],
    ["audit_report.pdf", "security_findings.xlsx"]
]

# Constructing the list of 5 sample tasks
tasks = []
for i in range(5):
    task_id = str(uuid.uuid4())
    task = {
        "_id": task_id,
        "title": titles[i],
        "description": descriptions[i],
        "dueDate": (datetime.now() + timedelta(days=random.randint(5, 20))).isoformat(),
        "status": "pending",
        "priority": random.choice(["low", "medium", "high"]),
        "assignedTo": [str(uuid.uuid4()) for _ in range(3)],
        "todos": [
            {
                "_id": str(uuid.uuid4()),
                "text": todo,
                "completed": random.choice([False, True])
            } for todo in todo_samples[i]
        ],
        "attachments": [
            {
                "filename": name,
                "url": f"https://example.com/files/{name.replace(' ', '_')}"
            } for name in attachment_samples[i]
        ],
        "createdAt": datetime.now().isoformat(),
        "updatedAt": datetime.now().isoformat()
    }
    tasks.append(task)

tasks
