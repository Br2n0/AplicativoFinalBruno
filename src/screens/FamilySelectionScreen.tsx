import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { FamilyService } from '../services/FamilyService';
import { Family, FamilyInvite } from '../types';
import { CustomInput } from '../components/CustomInput';

export const FamilySelectionScreen = () => {
  const { user } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [invites, setInvites] = useState<FamilyInvite[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [user?.email]);

  const loadData = async () => {
    if (user) {
      const userFamilies = await FamilyService.getFamilies();
      const userInvites = await FamilyService.getInvites(user.email);
      setFamilies(userFamilies);
      setInvites(userInvites.filter(invite => invite.status === 'pending'));
    }
  };

  const handleCreateFamily = async () => {
    if (!newFamilyName.trim()) {
      Alert.alert('Erro', 'Por favor, insira um nome para a família');
      return;
    }

    try {
      setLoading(true);
      await FamilyService.createFamily(newFamilyName, user!.id);
      setShowCreateModal(false);
      setNewFamilyName('');
      loadData();
      Alert.alert('Sucesso', 'Família criada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a família');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinFamily = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('Erro', 'Por favor, insira o código de convite');
      return;
    }

    try {
      setLoading(true);
      const family = await FamilyService.getFamilyByInviteCode(inviteCode);
      
      if (!family) {
        Alert.alert('Erro', 'Código de convite inválido');
        return;
      }

      await FamilyService.addFamilyMember({
        id: Date.now().toString(),
        userId: user!.id,
        familyId: family.id,
        role: 'member',
        joinedAt: new Date().toISOString(),
      });

      setShowJoinModal(false);
      setInviteCode('');
      loadData();
      Alert.alert('Sucesso', 'Você entrou na família com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível entrar na família');
    } finally {
      setLoading(false);
    }
  };

  const renderFamilyItem = ({ item }: { item: Family }) => (
    <TouchableOpacity style={styles.familyCard}>
      <Text style={styles.familyName}>{item.name}</Text>
      <Text style={styles.familyCode}>Código: {item.inviteCode}</Text>
    </TouchableOpacity>
  );

  const renderInviteItem = ({ item }: { item: FamilyInvite }) => (
    <View style={styles.inviteCard}>
      <Text style={styles.inviteText}>Convite para família</Text>
      <View style={styles.inviteActions}>
        <TouchableOpacity
          style={[styles.inviteButton, styles.acceptButton]}
          onPress={() => handleAcceptInvite(item.id)}
        >
          <Text style={styles.inviteButtonText}>Aceitar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.inviteButton, styles.rejectButton]}
          onPress={() => handleRejectInvite(item.id)}
        >
          <Text style={styles.inviteButtonText}>Recusar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await FamilyService.updateInviteStatus(inviteId, 'accepted');
      loadData();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível aceitar o convite');
    }
  };

  const handleRejectInvite = async (inviteId: string) => {
    try {
      await FamilyService.updateInviteStatus(inviteId, 'rejected');
      loadData();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível recusar o convite');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suas Famílias</Text>

      {families.length > 0 ? (
        <FlatList
          data={families}
          renderItem={renderFamilyItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      ) : (
        <Text style={styles.emptyText}>
          Você ainda não participa de nenhuma família
        </Text>
      )}

      {invites.length > 0 && (
        <>
          <Text style={styles.subtitle}>Convites Pendentes</Text>
          <FlatList
            data={invites}
            renderItem={renderInviteItem}
            keyExtractor={item => item.id}
            style={styles.list}
          />
        </>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.createButton]}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.buttonText}>Criar Família</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.joinButton]}
          onPress={() => setShowJoinModal(true)}
        >
          <Text style={styles.buttonText}>Entrar em uma Família</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Criar Família */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Criar Nova Família</Text>
            <CustomInput
              placeholder="Nome da família"
              value={newFamilyName}
              onChangeText={setNewFamilyName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleCreateFamily}
                disabled={loading}
              >
                <Text style={styles.modalButtonText}>
                  {loading ? 'Criando...' : 'Criar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Entrar em Família */}
      <Modal
        visible={showJoinModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowJoinModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Entrar em uma Família</Text>
            <CustomInput
              placeholder="Código de convite"
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="characters"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowJoinModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleJoinFamily}
                disabled={loading}
              >
                <Text style={styles.modalButtonText}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 8,
  },
  list: {
    flex: 1,
  },
  emptyText: {
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
  familyCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  familyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  familyCode: {
    fontSize: 14,
    color: '#BBBBBB',
  },
  inviteCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  inviteText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  inviteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  inviteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  inviteButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#673AB7',
    marginRight: 8,
  },
  joinButton: {
    backgroundColor: '#3F51B5',
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#757575',
  },
  confirmButton: {
    backgroundColor: '#673AB7',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});