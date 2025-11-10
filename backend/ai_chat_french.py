"""
French language support for AI Chat responses
"""

def get_french_responses():
    return {
        'temperature_success': 'Température enregistrée avec succès:\n• Emplacement: {location}\n• Température: {temperature}°C\n• Statut: {status}',
        'temperature_error': '❌ Échec de l\'enregistrement de la température. Veuillez vérifier votre saisie.',
        'temperature_help': 'Veuillez spécifier la température et l\'emplacement. Exemple: "Enregistrer température de 3 degrés dans chambre froide"',
        
        'product_success': '✅ Produit "{name}" ajouté avec succès au système.',
        'product_error': '❌ Échec de l\'ajout du produit. Veuillez réessayer.',
        'product_help': 'Veuillez spécifier le nom du produit. Exemple: "Ajouter produit Saumon frais avec allergènes poisson"',
        
        'room_success': '✅ Salle "{room}" marquée comme nettoyée avec succès.',
        'room_error': '❌ Échec du marquage de la salle comme nettoyée. Veuillez vérifier le nom de la salle.',
        'room_help': 'Veuillez spécifier le nom de la salle. Exemple: "Nettoyer cuisine"',
        
        'compliance_status': 'Statut de Conformité HACCP: {status}\n\n• Alertes Température: {alerts}\n• Coût Mensuel: ${cost}\n• Logs Récents: {logs}\n\n{message}',
        'compliance_error': '❌ Échec de l\'obtention du statut de conformité.',
        
        'products_empty': 'Aucun produit trouvé dans le système.',
        'products_list': 'Produits dans le Système:\n\n',
        'products_error': '❌ Échec de la récupération des produits.',
        
        'usage_report': 'Rapport d\'Utilisation de la Plateforme:\n\n• Coût Total: ${total}\n• Coût Mensuel: ${monthly}\n• Économies Serverless: ~85% vs hébergement traditionnel\n\n💡 Le modèle pay-per-use maintient les coûts bas!',
        'usage_error': '❌ Échec de l\'obtention du rapport d\'utilisation.',
        
        'help_message': 'Je peux vous aider avec ces tâches HACCP:\n\n🌡️ **Enregistrement de Température**\n"Enregistrer température de 3 degrés dans chambre froide"\n\n🥘 **Gestion des Produits**\n"Ajouter produit Thon frais avec allergènes poisson"\n"Lister tous les produits"\n\n🧹 **Gestion du Nettoyage**\n"Nettoyer cuisine"\n"Marquer zone de préparation comme nettoyée"\n\n📊 **Statut et Rapports**\n"Quel est notre statut de conformité?"\n"Afficher rapport d\'utilisation"\n\n❗ **Signalement d\'Incidents**\n"Signaler incident de température dans congélateur"\n\nDites-moi simplement ce dont vous avez besoin en langage naturel!',
        
        'default_response': 'Je comprends que vous voulez: "{input}"\n\nJe peux aider avec l\'enregistrement des températures, la gestion des produits, le nettoyage des salles et les rapports de statut. Pourriez-vous être plus spécifique? Tapez "aide" pour des exemples.',
        
        'ai_thinking': 'L\'IA réfléchit...',
        'error_general': '❌ Désolé, j\'ai rencontré une erreur lors du traitement de votre demande. Veuillez réessayer.'
    }